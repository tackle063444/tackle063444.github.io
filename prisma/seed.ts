import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialBranches = [
	{ id: "BR-001", name: "สำนักงานใหญ่ (HQ)", code: "HQ" },
	{ id: "BR-002", name: "สาขาสยาม (Siam)", code: "SIAM" },
	{ id: "BR-003", name: "สาขาเซ็นทรัล (Central)", code: "CNT" },
];

const initialCategories = [
	{ id: "CAT-001", name: "อิเล็กทรอนิกส์ (Electronics)", code: "ELEC" },
	{ id: "CAT-002", name: "เฟอร์นิเจอร์ (Furniture)", code: "FURN" },
	{ id: "CAT-003", name: "อุปกรณ์เสริม (Accessories)", code: "ACC" },
	{ id: "CAT-004", name: "เครื่องเสียง (Audio)", code: "AUDIO" },
];

const initialProducts = [
	{
		id: "PROD-0001",
		sku: "ELEC-001",
		name: "เมาส์ไร้สายพรีเมียม (Premium Wireless Mouse)",
		categoryId: "CAT-001",
		price: 1290,
		costPrice: 800,
	},
	{
		id: "PROD-0002",
		sku: "ELEC-002",
		name: "คีย์บอร์ด RGB (Mechanical Keyboard)",
		categoryId: "CAT-001",
		price: 3500,
		costPrice: 2000,
	},
	{
		id: "PROD-0003",
		sku: "FURN-001",
		name: "เก้าอี้ทำงาน (Ergonomic Chair)",
		categoryId: "CAT-002",
		price: 8900,
		costPrice: 5000,
	},
	{
		id: "PROD-0004",
		sku: "ACC-001",
		name: "USB-C Hub",
		categoryId: "CAT-003",
		price: 890,
		costPrice: 400,
	},
	{
		id: "PROD-0005",
		sku: "ACC-002",
		name: "แท่นวางโน๊ตบุ๊ค",
		categoryId: "CAT-003",
		price: 590,
		costPrice: 200,
	},
	{
		id: "PROD-0006",
		sku: "ELEC-003",
		name: "จอคอมพิวเตอร์ 27 นิ้ว 4K",
		categoryId: "CAT-001",
		price: 12500,
		costPrice: 9000,
	},
	{
		id: "PROD-0007",
		sku: "AUDIO-001",
		name: "หูฟังบลูทูธ",
		categoryId: "CAT-004",
		price: 1590,
		costPrice: 900,
	},
];

const initialStocks = [
	{
		id: "STK-001",
		productId: "PROD-0001",
		branchId: "BR-001",
		quantity: 45,
		reorderPoint: 50,
	},
	{
		id: "STK-002",
		productId: "PROD-0002",
		branchId: "BR-001",
		quantity: 12,
		reorderPoint: 20,
	},
	{
		id: "STK-003",
		productId: "PROD-0003",
		branchId: "BR-001",
		quantity: 4,
		reorderPoint: 5,
	},
	{
		id: "STK-004",
		productId: "PROD-0004",
		branchId: "BR-001",
		quantity: 120,
		reorderPoint: 50,
	},
	{
		id: "STK-005",
		productId: "PROD-0001",
		branchId: "BR-002",
		quantity: 20,
		reorderPoint: 10,
	},
	{
		id: "STK-006",
		productId: "PROD-0006",
		branchId: "BR-002",
		quantity: 2,
		reorderPoint: 5,
	},
	{
		id: "STK-007",
		productId: "PROD-0001",
		branchId: "BR-003",
		quantity: 15,
		reorderPoint: 10,
	},
	{
		id: "STK-008",
		productId: "PROD-0007",
		branchId: "BR-003",
		quantity: 30,
		reorderPoint: 10,
	},
];

async function main() {
	console.log("Start seeding ...");

	// Seed Branches
	for (const branch of initialBranches) {
		await prisma.branch.upsert({
			where: { id: branch.id },
			update: {},
			create: {
				id: branch.id,
				name: branch.name,
				code: branch.code,
			},
		});
	}

	// Seed Categories
	for (const category of initialCategories) {
		await prisma.category.upsert({
			where: { id: category.id },
			update: {},
			create: {
				id: category.id,
				name: category.name,
				code: category.code,
			},
		});
	}

	// Seed Products
	for (const product of initialProducts) {
		await prisma.product.upsert({
			where: { id: product.id },
			update: {},
			create: {
				id: product.id,
				sku: product.sku,
				name: product.name,
				categoryId: product.categoryId,
				basePrice: product.price,
				costPrice: product.costPrice,
				inventory: 1000, // Initial central stock
			},
		});
	}

	// Seed Stocks
	for (const stock of initialStocks) {
		await prisma.stock.upsert({
			where: { id: stock.id },
			update: {},
			create: {
				id: stock.id,
				branchId: stock.branchId,
				productId: stock.productId,
				quantity: stock.quantity,
				reorderPoint: stock.reorderPoint,
			},
		});
	}

	// Seed Admin User
	const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
	await prisma.user.upsert({
		where: { email: "admin@sp-system.com" },
		update: {
			password: hashedPasswordAdmin,
		},
		create: {
			email: "admin@sp-system.com",
			name: "Admin User",
			password: hashedPasswordAdmin,
			role: "ADMIN",
		},
	});

	// Seed Staff User
	const hashedPasswordStaff = await bcrypt.hash("staff123", 10);
	await prisma.user.upsert({
		where: { email: "staff@sp-system.com" },
		update: {
			password: hashedPasswordStaff,
		},
		create: {
			email: "staff@sp-system.com",
			name: "Staff User",
			password: hashedPasswordStaff,
			role: "STAFF",
		},
	});

	console.log("Seeding finished.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
