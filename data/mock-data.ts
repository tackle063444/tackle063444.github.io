export interface Branch {
	id: string;
	name: string;
	code: string;
}

export interface Category {
	id: string;
	name: string;
	code: string;
}

export interface Product {
	id: string;
	sku: string;
	name: string;
	categoryId: string;
	price: number;
	costPrice: number;
	status: "มีสินค้า" | "สินค้าใกล้หมด" | "สินค้าหมด" | "วิกฤต" | "ปกติ";
}

export interface Stock {
	id: string;
	productId: string;
	branchId: string;
	quantity: number;
	reorderPoint: number;
}

export const initialBranches: Branch[] = [
	{ id: "BR-001", name: "สำนักงานใหญ่ (HQ)", code: "HQ" },
	{ id: "BR-002", name: "สาขาสยาม (Siam)", code: "SIAM" },
	{ id: "BR-003", name: "สาขาเซ็นทรัล (Central)", code: "CNT" },
];

export const initialCategories: Category[] = [
	{ id: "CAT-001", name: "อิเล็กทรอนิกส์ (Electronics)", code: "ELEC" },
	{ id: "CAT-002", name: "เฟอร์นิเจอร์ (Furniture)", code: "FURN" },
	{ id: "CAT-003", name: "อุปกรณ์เสริม (Accessories)", code: "ACC" },
	{ id: "CAT-004", name: "เครื่องเสียง (Audio)", code: "AUDIO" },
];

export const initialProducts: Product[] = [
	{
		id: "PROD-0001",
		sku: "ELEC-001",
		name: "เมาส์ไร้สายพรีเมียม (Premium Wireless Mouse)",
		categoryId: "CAT-001",
		price: 1290,
		costPrice: 800,
		status: "มีสินค้า",
	},
	{
		id: "PROD-0002",
		sku: "ELEC-002",
		name: "คีย์บอร์ด RGB (Mechanical Keyboard)",
		categoryId: "CAT-001",
		price: 3500,
		costPrice: 2000,
		status: "สินค้าใกล้หมด",
	},
	{
		id: "PROD-0003",
		sku: "FURN-001",
		name: "เก้าอี้ทำงาน (Ergonomic Chair)",
		categoryId: "CAT-002",
		price: 8900,
		costPrice: 5000,
		status: "วิกฤต",
	},
	{
		id: "PROD-0004",
		sku: "ACC-001",
		name: "USB-C Hub",
		categoryId: "CAT-003",
		price: 890,
		costPrice: 400,
		status: "มีสินค้า",
	},
	{
		id: "PROD-0005",
		sku: "ACC-002",
		name: "แท่นวางโน๊ตบุ๊ค",
		categoryId: "CAT-003",
		price: 590,
		costPrice: 200,
		status: "สินค้าหมด",
	},
	{
		id: "PROD-0006",
		sku: "ELEC-003",
		name: "จอคอมพิวเตอร์ 27 นิ้ว 4K",
		categoryId: "CAT-001",
		price: 12500,
		costPrice: 9000,
		status: "สินค้าใกล้หมด",
	},
	{
		id: "PROD-0007",
		sku: "AUDIO-001",
		name: "หูฟังบลูทูธ",
		categoryId: "CAT-004",
		price: 1590,
		costPrice: 900,
		status: "มีสินค้า",
	},
];

export const initialStocks: Stock[] = [
	// HQ Stocks
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

	// Siam Stocks
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

	// Central Stocks
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
