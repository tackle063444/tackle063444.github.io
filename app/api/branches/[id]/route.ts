import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const branch = await db
			.selectFrom("Branch")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();

		if (!branch) {
			return NextResponse.json({ error: "Branch not found" }, { status: 404 });
		}

		// Also fetch stocks for this branch
		const stocks = await db
			.selectFrom("Stock")
			.innerJoin("Product", "Product.id", "Stock.productId")
			.select([
				"Stock.id",
				"Stock.quantity",
				"Stock.reorderPoint",
				"Product.name as productName",
				"Product.sku as productSku",
				"Product.id as productId",
				"Product.imageUrl as productImage",
			])
			.where("Stock.branchId", "=", id)
			.execute();

		return NextResponse.json({ ...branch, stocks });
	} catch (error) {
		console.error("Error fetching branch detail:", error);
		return NextResponse.json(
			{ error: "Failed to fetch branch detail" },
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
		const { name, code, location, image } = body;

		const updatedBranch = await db
			.updateTable("Branch")
			.set({
				name,
				code,
				location,
				image,
				updatedAt: new Date(),
			})
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirstOrThrow();

		return NextResponse.json(updatedBranch);
	} catch (error) {
		console.error("Error updating branch:", error);
		return NextResponse.json(
			{ error: "Failed to update branch" },
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

		// Check if there are stocks in this branch
		const stockResult = await db
			.selectFrom("Stock")
			.select(({ fn }) => fn.count<string>("id").as("count"))
			.where("branchId", "=", id)
			.executeTakeFirst();

		const count = Number(stockResult?.count || 0);

		if (count > 0) {
			return NextResponse.json(
				{ error: "Cannot delete branch with existing stock" },
				{ status: 400 }
			);
		}

		await db.deleteFrom("Branch").where("id", "=", id).execute();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting branch:", error);
		return NextResponse.json(
			{ error: "Failed to delete branch" },
			{ status: 500 }
		);
	}
}
