import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.NEXT_ENCRYPTION_KEY!, "hex");
const JOINER = "--~~w~~--";

export function encrypt(text: string) {
  const IV = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return [IV.toString("hex"), encrypted].join(JOINER);
}

export function decrypt(text: string) {
  const [ivHex, encryptedData] = text.split(JOINER);
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
