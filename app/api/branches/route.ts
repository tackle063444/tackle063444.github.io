import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
	try {
		const branches = await db
			.selectFrom("Branch")
			.selectAll()
			.orderBy("code", "asc")
			.execute();
		return NextResponse.json(branches);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch branches" },
			{ status: 500 }
		);
	}
}
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, code, location, image } = body;

		if (!name || !code) {
			return NextResponse.json(
				{ error: "Name and Code are required" },
				{ status: 400 }
			);
		}

		const newBranch = await db
			.insertInto("Branch")
			.values({
				id: uuidv4(),
				name,
				code,
				location,
				image,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return NextResponse.json(newBranch);
	} catch (error) {
		console.error("Error creating branch:", error);
		return NextResponse.json(
			{ error: "Failed to create branch" },
			{ status: 500 }
		);
	}
}
