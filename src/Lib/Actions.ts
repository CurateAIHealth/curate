
  import crypto from "crypto";
  import bcrypt from "bcryptjs";
  export const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  export const isValidAadhar = (a: string) => /^\d{12}$/.test(a.replace(/\s/g, ''))








const algorithm = "aes-256-cbc";

const secretKey = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, "hex");

export function encrypt(text: any) {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}

export function decrypt(hash: { iv: any; content: any }) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );

  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted; 
}


export function hashValue(value: any) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function verifySHA256(password: any, hashed: any) {
  return hashValue(password) === hashed;
}