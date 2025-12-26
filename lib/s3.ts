import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: process.env.AWS_REGION || "ap-southeast-2",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

export async function uploadFileToS3(
	file: Buffer,
	fileName: string,
	contentType: string
) {
	const fileExtension = fileName.split(".").pop();
	const uniqueFileName = `${Date.now()}-${Math.random()
		.toString(36)
		.substring(2, 15)}.${fileExtension}`;

	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET,
		Key: uniqueFileName,
		Body: file,
		ContentType: contentType,
	});

	try {
		await s3Client.send(command);
		const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
		return url;
	} catch (error) {
		console.error("Error uploading to S3:", error);
		throw error;
	}
}
