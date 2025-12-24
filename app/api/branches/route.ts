import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
