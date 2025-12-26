import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "kysely";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: branchId } = await params;
		const { searchParams } = new URL(req.url);
		const from = searchParams.get("from");
		const to = searchParams.get("to");

		let query = db
			.selectFrom("Transaction")
			.selectAll("Transaction")
			.select((eb) => [
				// Join with User to get creator name
				eb
					.selectFrom("User")
					.select("name")
					.whereRef("User.id", "=", "Transaction.createdById")
					.as("creatorName"),
				// Join with TransactionItem and Product to get items
				// Note: Kysely doesn't have direct relation mapping like Prisma Include,
				// so strictly speaking we might need a separate query or a json_agg if supported.
				// For simplicity in this demo environment, we will fetch items separately or try to use Prisma if available for nested includes.
				// BUT the project uses Kysely for type-safety but seems to use `db` from `@/lib/db`.
				// Let's check `@/lib/db`. If it's Prisma-Kysely wrapper, we might be able to use Prisma for easier nested fetching.
			])
			.where("branchId", "=", branchId)
			.orderBy("createdAt", "desc");

		if (from) {
			query = query.where("createdAt", ">=", new Date(from));
		}
		if (to) {
			// Add 1 day to include the end date fully if it's just a date string
			const toDate = new Date(to);
			toDate.setHours(23, 59, 59, 999);
			query = query.where("createdAt", "<=", toDate);
		}

		// Since complex nested includes are harder with just query builder, let's use Prisma for this specific read operation
		// if the user provided db client supports it, OR verify if `db` is purely Kysely.
		// Given the `prisma/seed.ts` used PrismaClient, let's use PrismaClient for fetching relations easily.

		// Changing approach to use pure PrismaClient for this read to get nested relations easily

		return await GET_Prisma(branchId, from, to);
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch transactions" },
			{ status: 500 }
		);
	}
}

// Helper to use PrismaClient directly for nested includes
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function GET_Prisma(
	branchId: string,
	from: string | null,
	to: string | null
) {
	const whereClause: any = {
		branchId: branchId,
	};

	if (from || to) {
		whereClause.createdAt = {};
		if (from) whereClause.createdAt.gte = new Date(from);
		if (to) {
			const toDate = new Date(to);
			toDate.setHours(23, 59, 59, 999);
			whereClause.createdAt.lte = toDate;
		}
	}

	const transactions = await prisma.transaction.findMany({
		where: whereClause,
		include: {
			createdBy: {
				select: { name: true, email: true },
			},
			items: {
				include: {
					product: {
						select: { name: true, sku: true },
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	// Transform for frontend if needed, or return as is
	return NextResponse.json(transactions);
}
