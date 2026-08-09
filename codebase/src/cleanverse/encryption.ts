import crypto from 'crypto';

/**
 * Cleanverse API v5.6 AES Encryption / Decryption Module
 * 
 * Algorithm: AES/CBC/PKCS5Padding
 * IV: Fixed IV of 16 zero bytes ('0x00000000000000000000000000000000')
 * Key: Base64-decoded api-key (Derives 32-byte key for AES-256-CBC)
 * Output: Base64 string wrapped in { "data": "<Base64 Ciphertext>" }
 */

const FIXED_IV = Buffer.alloc(16, 0); // 16 zero-bytes

function normalizeKeyBuffer(apiKeyBase64: string): Buffer {
  let keyBuffer: Buffer;
  try {
    keyBuffer = Buffer.from(apiKeyBase64, 'base64');
  } catch {
    keyBuffer = Buffer.from(apiKeyBase64, 'utf8');
  }

  if (keyBuffer.length === 32 || keyBuffer.length === 16) {
    return keyBuffer;
  }

  // Normalize non-standard key length to 32 bytes via SHA-256
  return crypto.createHash('sha256').update(keyBuffer).digest();
}

/**
 * Encrypts a JSON payload object into Cleanverse Base64 ciphertext envelope
 */
export function encryptCleanversePayload(payload: object, apiKeyBase64: string): { data: string } {
  const jsonString = JSON.stringify(payload);
  const keyBuffer = normalizeKeyBuffer(apiKeyBase64);
  const algorithm = keyBuffer.length === 16 ? 'aes-128-cbc' : 'aes-256-cbc';
  
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, FIXED_IV);
  let encrypted = cipher.update(jsonString, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return { data: encrypted };
}

/**
 * Decrypts a Base64 ciphertext from Cleanverse API back into JSON object
 */
export function decryptCleanversePayload<T = any>(ciphertextBase64: string, apiKeyBase64: string): T {
  const keyBuffer = normalizeKeyBuffer(apiKeyBase64);
  const algorithm = keyBuffer.length === 16 ? 'aes-128-cbc' : 'aes-256-cbc';
  
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, FIXED_IV);
  let decrypted = decipher.update(ciphertextBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted) as T;
}
