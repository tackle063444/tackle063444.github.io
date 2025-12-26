import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: branchId } = await params;

		const now = new Date();

		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);

		const weekStart = new Date(now);
		weekStart.setDate(weekStart.getDate() - now.getDay()); // Start of this week (Sunday)
		weekStart.setHours(0, 0, 0, 0);

		const yearStart = new Date(now.getFullYear(), 0, 1); // Start of this year

		// Today's Sales
		const todayResult = await db
			.selectFrom("Transaction")
			.select(({ fn }) => fn.sum<string>("totalAmount").as("sum"))
			.where("branchId", "=", branchId)
			.where("type", "=", "SALE")
			.where("createdAt", ">=", todayStart)
			.executeTakeFirst();

		// Week's Sales
		const weekResult = await db
			.selectFrom("Transaction")
			.select(({ fn }) => fn.sum<string>("totalAmount").as("sum"))
			.where("branchId", "=", branchId)
			.where("type", "=", "SALE")
			.where("createdAt", ">=", weekStart)
			.executeTakeFirst();

		// Year's Sales
		const yearResult = await db
			.selectFrom("Transaction")
			.select(({ fn }) => fn.sum<string>("totalAmount").as("sum"))
			.where("branchId", "=", branchId)
			.where("type", "=", "SALE")
			.where("createdAt", ">=", yearStart)
			.executeTakeFirst();

		return NextResponse.json({
			today: Number(todayResult?.sum || 0),
			week: Number(weekResult?.sum || 0),
			year: Number(yearResult?.sum || 0),
		});
	} catch (error) {
		console.error("Error fetching branch stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch branch stats" },
			{ status: 500 }
		);
	}
}
