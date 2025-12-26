import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    STAFF: "STAFF"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const TransactionType = {
    SALE: "SALE",
    RESTOCK: "RESTOCK",
    ADJUST: "ADJUST",
    TRANSFER: "TRANSFER"
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export type Branch = {
    id: string;
    code: string;
    name: string;
    location: string | null;
    image: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Category = {
    id: string;
    code: string;
    name: string;
};
export type Product = {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    unit: Generated<string>;
    basePrice: string;
    costPrice: Generated<string>;
    inventory: Generated<number>;
    categoryId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Stock = {
    id: string;
    branchId: string;
    productId: string;
    quantity: Generated<number>;
    reorderPoint: Generated<number>;
};
export type Transaction = {
    id: string;
    type: TransactionType;
    branchId: string;
    totalAmount: string;
    createdById: string;
    note: string | null;
    createdAt: Generated<Timestamp>;
};
export type TransactionItem = {
    id: string;
    transactionId: string;
    productId: string;
    quantity: number;
    unitPrice: string;
    subtotal: string;
};
export type User = {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Generated<Role>;
    branchId: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Branch: Branch;
    Category: Category;
    Product: Product;
    Stock: Stock;
    Transaction: Transaction;
    TransactionItem: TransactionItem;
    User: User;
};
