import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
	try {
		const categories = await db
			.selectFrom("Category")
			.selectAll()
			.orderBy("name", "asc")
			.execute();
		return NextResponse.json(categories);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, code } = body;

		const newCategory = await db
			.insertInto("Category")
			.values({
				id: uuidv4(),
				name,
				code,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return NextResponse.json(newCategory);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create category" },
			{ status: 500 }
		);
	}
}
