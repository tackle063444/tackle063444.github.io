import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: branchId } = await params;
		const body = await req.json();
		const { productId, quantity, reorderPoint } = body;
		const qty = Number(quantity || 0);

		if (!productId) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Use transaction to ensure consistency
		const result = await db.transaction().execute(async (trx) => {
			// 1. Check Product Inventory (Central)
			const product = await trx
				.selectFrom("Product")
				.select(["inventory", "name"])
				.where("id", "=", productId)
				.executeTakeFirst();

			if (!product) {
				throw new Error("Product not found");
			}

			if (product.inventory < qty) {
				throw new Error(`สต๊อกกลางไม่เพียงพอ (เหลือ ${product.inventory} ชิ้น)`);
			}

			// 2. Check if product already exists in this branch
			const existing = await trx
				.selectFrom("Stock")
				.selectAll()
				.where("branchId", "=", branchId)
				.where("productId", "=", productId)
				.executeTakeFirst();

			if (existing) {
				throw new Error("สินค้ามีอยู่ในสาขานี้แล้ว กรุณาใช้เมนูปรับสต๊อก");
			}

			// 3. Insert new Stock to Branch
			const newStock = await trx
				.insertInto("Stock")
				.values({
					id: uuidv4(),
					branchId,
					productId,
					quantity: qty,
					reorderPoint: Number(reorderPoint || 10),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			// 4. Deduct from Central Inventory
			await trx
				.updateTable("Product")
				.set({
					inventory: product.inventory - qty,
				})
				.where("id", "=", productId)
				.execute();

			return newStock;
		});

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("Error adding stock to branch:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to add stock" },
			{ status: error.message?.includes("สต๊อก") ? 400 : 500 }
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: branchId } = await params;
		const body = await req.json();
		const { productId, adjustment, stockId } = body;
		const adj = Number(adjustment);

		const result = await db.transaction().execute(async (trx) => {
			// 1. Find the Stock Record
			let query = trx.selectFrom("Stock").selectAll();

			if (stockId) {
				query = query.where("id", "=", stockId);
			} else if (productId) {
				query = query
					.where("branchId", "=", branchId)
					.where("productId", "=", productId);
			} else {
				throw new Error("Stock identification missing");
			}

			const stock = await query.executeTakeFirst();
			if (!stock) throw new Error("Stock not found");

			// 2. Determine new quantity for Branch
			const newQuantity = Number(stock.quantity) + adj;
			if (newQuantity < 0) {
				throw new Error("สินค้าในสาขาไม่พอให้ปรับลด");
			}

			// 3. If adding stock (adj > 0), check and deduct form Central
			if (adj > 0) {
				const product = await trx
					.selectFrom("Product")
					.select(["inventory"])
					.where("id", "=", stock.productId)
					.executeTakeFirst();

				if (!product) throw new Error("Product definition not found");

				if (product.inventory < adj) {
					throw new Error(`สต๊อกกลางไม่เพียงพอ (เหลือ ${product.inventory} ชิ้น)`);
				}

				// Deduct from Central
				await trx
					.updateTable("Product")
					.set({ inventory: product.inventory - adj })
					.where("id", "=", stock.productId)
					.execute();
			}
			// Note: If removing stock (adj < 0), we assume it's lost/sold/damaged, NOT returned to central.
			// If return logic is needed, we would increment Central here.

			// 4. Update Branch Stock
			const updatedStock = await trx
				.updateTable("Stock")
				.set({ quantity: newQuantity })
				.where("id", "=", stock.id)
				.returningAll()
				.executeTakeFirstOrThrow();

			return updatedStock;
		});

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("Error updating stock quantity:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to update stock" },
			{
				status:
					error.message?.includes("สต๊อก") || error.message?.includes("สินค้า")
						? 400
						: 500,
			}
		);
	}
}
