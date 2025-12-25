import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const category = await db
			.selectFrom("Category")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();

		if (!category) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		return NextResponse.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		return NextResponse.json(
			{ error: "Failed to fetch category" },
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
		const { name, code } = body;

		const updatedCategory = await db
			.updateTable("Category")
			.set({
				name,
				code,
			})
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst();

		if (!updatedCategory) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		return NextResponse.json(updatedCategory);
	} catch (error) {
		console.error("Error updating category:", error);
		return NextResponse.json(
			{ error: "Failed to update category" },
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
		// Check if category exists
		const category = await db
			.selectFrom("Category")
			.select("id")
			.where("id", "=", id)
			.executeTakeFirst();

		if (!category) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 });
		}

		// Check if category is being used by products
		const productsUsingCategory = await db
			.selectFrom("Product")
			.select("id")
			.where("categoryId", "=", id)
			.executeTakeFirst();

		if (productsUsingCategory) {
			return NextResponse.json(
				{ error: "Cannot delete category that is being used by products" },
				{ status: 400 }
			);
		}

		// Delete the category
		await db.deleteFrom("Category").where("id", "=", id).execute();

		return NextResponse.json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ error: "Failed to delete category" },
			{ status: 500 }
		);
	}
}
