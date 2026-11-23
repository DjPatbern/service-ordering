import "server-only";
import sharp from "sharp";
import { Binary } from "mongodb";
import { getDb } from "./db";
import { HttpError } from "./http";
export async function saveImage(file: File, kind: "product" | "proof") {
  if (!file.size || file.size > 2 * 1024 * 1024)
    throw new HttpError(
      400,
      "Choose a JPG, PNG or WebP image no larger than 2 MB.",
    );
  let data: Buffer;
  try {
    const input = sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 16000000,
      animated: false,
    });
    const metadata = await input.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || ""))
      throw new Error("Unsupported format");
    data = await input
      .rotate()
      .resize({
        width: kind === "proof" ? 1800 : 1400,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: kind === "proof" ? 90 : 85 })
      .toBuffer();
  } catch {
    throw new HttpError(
      400,
      "This image could not be read. Use a valid JPG, PNG or WebP file.",
    );
  }
  const db = await getDb();
  const result = await db.collection("media").insertOne({
    kind,
    data: new Binary(data),
    contentType: "image/webp",
    createdAt: new Date(),
  });
  return result.insertedId.toHexString();
}
export async function readUpload(request: Request) {
  if (Number(request.headers.get("content-length")) > 2200000)
    throw new HttpError(413, "Upload must be no larger than 2 MB.");
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    throw new HttpError(400, "Please choose an image.");
  return { form, file };
}
