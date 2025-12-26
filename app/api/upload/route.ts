import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/lib/s3";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "File is required." }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = file.name;
		const contentType = file.type;

		const url = await uploadFileToS3(buffer, fileName, contentType);

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload file." },
			{ status: 500 }
		);
	}
}
