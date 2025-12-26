import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Ensure user.id is accessible (we added it in the session callback)
		const userId = (session.user as any).id;
		if (!userId) {
			return NextResponse.json(
				{ error: "User ID not found in session" },
				{ status: 400 }
			);
		}

		const body = await req.json();
		const { branchId, items, totalAmount, note } = body;

		if (!branchId || !items || items.length === 0) {
			return NextResponse.json(
				{ error: "Branch and items are required" },
				{ status: 400 }
			);
		}

		const result = await db.transaction().execute(async (trx) => {
			// 1. Create the Transaction
			const transaction = await trx
				.insertInto("Transaction")
				.values({
					id: uuidv4(),
					type: "SALE",
					branchId,
					totalAmount: Number(totalAmount).toString(),
					createdById: userId,
					note,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			// 2. Process each item
			for (const item of items) {
				const { productId, quantity, price } = item;

				// a. Create TransactionItem
				await trx
					.insertInto("TransactionItem")
					.values({
						id: uuidv4(),
						transactionId: transaction.id,
						productId,
						quantity: Number(quantity),
						unitPrice: Number(price).toString(),
						subtotal: Number(price * quantity).toString(),
					})
					.execute();

				// b. Deduct Stock from this branch
				const stock = await trx
					.selectFrom("Stock")
					.select(["id", "quantity"])
					.where("branchId", "=", branchId)
					.where("productId", "=", productId)
					.executeTakeFirst();

				if (!stock) {
					throw new Error(`Product ${productId} not found in branch stock`);
				}

				if (Number(stock.quantity) < Number(quantity)) {
					throw new Error(`Insufficient stock for product ${productId}`);
				}

				await trx
					.updateTable("Stock")
					.set({
						quantity: Number(stock.quantity) - Number(quantity),
					})
					.where("id", "=", stock.id)
					.execute();
			}

			return transaction;
		});

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("POS transaction failed:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to process sale" },
			{ status: 500 }
		);
	}
}
