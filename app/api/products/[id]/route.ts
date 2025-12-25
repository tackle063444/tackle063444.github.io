import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const product = await db
			.selectFrom("Product")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({
			...product,
			price: Number(product.basePrice),
			basePrice: Number(product.basePrice),
			costPrice: Number(product.costPrice),
		});
	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: "Failed to fetch product" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const { name, sku, categoryId, price, costPrice, imageUrl } = body;

		const updatedProduct = await db
			.updateTable("Product")
			.set({
				name,
				sku,
				categoryId,
				basePrice: price,
				costPrice: costPrice || 0,
				imageUrl,
				updatedAt: new Date(),
			})
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst();

		if (!updatedProduct) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({
			...updatedProduct,
			price: Number(updatedProduct.basePrice),
			basePrice: Number(updatedProduct.basePrice),
			costPrice: Number(updatedProduct.costPrice),
		});
	} catch (error) {
		console.error("Error updating product:", error);
		return NextResponse.json(
			{ error: "Failed to update product" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		// Check if product exists
		const product = await db
			.selectFrom("Product")
			.select("id")
			.where("id", "=", id)
			.executeTakeFirst();

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		// Delete related stock records first
		await db.deleteFrom("Stock").where("productId", "=", id).execute();
		// Delete the product
		await db.deleteFrom("Product").where("id", "=", id).execute();

		return NextResponse.json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting product:", error);
		return NextResponse.json(
			{ error: "Failed to delete product" },
			{ status: 500 }
		);
	}
}
