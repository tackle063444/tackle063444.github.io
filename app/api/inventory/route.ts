import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const branchId = searchParams.get("branchId");

	try {
		let query = db.selectFrom("Stock").selectAll();

		if (branchId) {
			query = query.where("branchId", "=", branchId);
		}

		const stocks = await query.execute();
		return NextResponse.json(stocks);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch inventory" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { action, branchId, productId, quantity, targetBranchId } = body; // Quantity here is the *adjustment* amount or *new* amount?
		// In DataContext `updateStock` was setting absolute value.
		// In `transferStock` checks were made.

		// Let's support: type: 'SET' (Absolute) and type: 'TRANSFER'

		if (action === "SET") {
			// Upsert Stock
			// Logic: Try update, if 0 rows updated, insert.
			// Or upsert via `onConflict`. Kysely supports onConflict.

			await db
				.insertInto("Stock")
				.values({
					id: uuidv4(),
					branchId,
					productId,
					quantity: quantity,
					reorderPoint: 10,
				})
				.onConflict((oc) =>
					oc.columns(["branchId", "productId"]).doUpdateSet({ quantity: quantity })
				)
				.execute();

			return NextResponse.json({ success: true });
		}

		if (action === "TRANSFER") {
			// Transaction
			await db.transaction().execute(async (trx) => {
				// 1. Deduct from Source
				const source = await trx
					.selectFrom("Stock")
					.select("quantity")
					.where("branchId", "=", branchId)
					.where("productId", "=", productId)
					.executeTakeFirst();

				if (!source || source.quantity < quantity) {
					throw new Error("Insufficient stock");
				}

				await trx
					.updateTable("Stock")
					.set({ quantity: source.quantity - quantity })
					.where("branchId", "=", branchId)
					.where("productId", "=", productId)
					.execute();

				// 2. Add to Target
				// Upsert target
				// Kysely Upsert inside transaction:
				// We need to check if exists or use onConflict
				await trx
					.insertInto("Stock")
					.values({
						id: uuidv4(),
						branchId: targetBranchId,
						productId,
						quantity: quantity,
						reorderPoint: 10,
					})
					.onConflict((oc) =>
						oc.columns(["branchId", "productId"]).doUpdateSet((eb) => ({
							quantity: eb("Stock.quantity", "+", quantity),
						}))
					)
					.execute();
			});

			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: error.message || "Operation failed" },
			{ status: 500 }
		);
	}
}
