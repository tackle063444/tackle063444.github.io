import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "kysely";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const branchId = searchParams.get("branchId");

	try {
		// 1. Total Revenue
		let revenueQuery = db
			.selectFrom("Transaction")
			.select(({ fn }) => fn.sum<string>("totalAmount").as("sum"))
			.where("type", "=", "SALE");

		if (branchId) {
			revenueQuery = revenueQuery.where("branchId", "=", branchId);
		}
		const revenue = await revenueQuery.executeTakeFirst();

		// 2. Sales Count
		let salesQuery = db
			.selectFrom("Transaction")
			.select(({ fn }) => fn.count<string>("id").as("count"))
			.where("type", "=", "SALE");

		if (branchId) {
			salesQuery = salesQuery.where("branchId", "=", branchId);
		}
		const salesCount = await salesQuery.executeTakeFirst();

		// 3. Total Stock (Quantity)
		let stockQuery = db
			.selectFrom("Stock")
			.select(({ fn }) => fn.sum<string>("quantity").as("sum"));

		if (branchId) {
			stockQuery = stockQuery.where("branchId", "=", branchId);
		}
		const totalStock = await stockQuery.executeTakeFirst();

		// 4. Low Stock Items (Fetched and filtered in JS to avoid build type errors with raw SQL)
		let allStocksQuery = db
			.selectFrom("Stock")
			.select(["quantity", "reorderPoint"]);

		if (branchId) {
			allStocksQuery = allStocksQuery.where("branchId", "=", branchId);
		}

		const allStocks = await allStocksQuery.execute();
		const lowStockCount = allStocks.filter(
			(s) => s.quantity < s.reorderPoint
		).length;

		// 5. Recent Sales
		let recentSalesQuery = db
			.selectFrom("Transaction")
			.innerJoin("User", "User.id", "Transaction.createdById")
			.innerJoin("Branch", "Branch.id", "Transaction.branchId")
			.select([
				"Transaction.id",
				"Transaction.totalAmount",
				"Transaction.createdAt",
				"User.name as userName",
				"Branch.name as branchName",
			])
			.where("Transaction.type", "=", "SALE")
			.orderBy("Transaction.createdAt", "desc")
			.limit(5);

		if (branchId) {
			recentSalesQuery = recentSalesQuery.where(
				"Transaction.branchId",
				"=",
				branchId
			);
		}
		const recentSales = await recentSalesQuery.execute();

		return NextResponse.json({
			totalRevenue: Number(revenue?.sum || 0),
			salesCount: Number(salesCount?.count || 0),
			totalStock: Number(totalStock?.sum || 0),
			lowStockCount: lowStockCount,
			recentSales: recentSales.map((s) => ({
				...s,
				totalAmount: Number(s.totalAmount),
			})),
		});
	} catch (error) {
		console.error("Dashboard stats error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard stats" },
			{ status: 500 }
		);
	}
}
