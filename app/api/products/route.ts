import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
	try {
		const products = await db
			.selectFrom("Product")
			.selectAll()
			.orderBy("createdAt", "desc")
			.execute();

		// Map Decimal to number for frontend (Kysely returns string/Decimal for numeric)
		const formattedProducts = products.map((p) => ({
			...p,
			price: Number(p.basePrice),
			basePrice: Number(p.basePrice),
			costPrice: Number(p.costPrice),
			status: "มีสินค้า", // Hardcoded for now
		}));

		return NextResponse.json(formattedProducts);
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, sku, categoryId, price, costPrice } = body;

		const newProduct = await db
			.insertInto("Product")
			.values({
				id: uuidv4(),
				name,
				sku,
				categoryId,
				basePrice: price,
				costPrice: costPrice || 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return NextResponse.json({
			...newProduct,
			basePrice: Number(newProduct.basePrice),
			costPrice: Number(newProduct.costPrice),
		});
	} catch (error) {
		console.error("Error creating product:", error);
		return NextResponse.json(
			{ error: "Failed to create product" },
			{ status: 500 }
		);
	}
}
