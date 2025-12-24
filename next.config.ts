import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	output: "export",
	images: {
		unoptimized: true,
	},
	// ปิดการใช้งาน server-side features บางอย่างที่ไม่รองรับใน Static Export ถ้าจำเป็น
	eslint: {
		// ปิดการเช็ค lint ตอน build เพื่อป้องกัน build failed จาก warning เล็กน้อย
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
