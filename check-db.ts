import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
	try {
		console.log("Connecting to database...");
		const userCount = await prisma.user.count();
		console.log(`Total users found: ${userCount}`);

		const users = await prisma.user.findMany({
			select: { email: true, role: true, name: true },
		});

		console.log("User list:");
		console.table(users);
	} catch (error) {
		console.error("Error connecting to database:", error);
	} finally {
		await prisma.$disconnect();
	}
}

checkUsers();
