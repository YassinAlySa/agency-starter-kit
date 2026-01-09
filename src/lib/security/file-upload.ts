/**
 * File Upload Security Utilities
 * Based on ARCHITECTURE.md Security Deep Dives
 * 
 * Validates file uploads using magic bytes verification
 */

// Magic bytes (file signatures) for common file types
const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "application/pdf": [0x25, 0x50, 0x44, 0x46],
};

// Allowed extensions (lowercase)
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];

// Max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate a file upload for security
 * @throws Error if file fails validation
 */
export async function validateFileUpload(file: File): Promise<void> {
  // 1. Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  if (file.size === 0) {
    throw new Error("Empty file");
  }

  // 2. Check extension
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Invalid extension: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
  }

  // 3. Check MIME type
  if (!Object.keys(MAGIC_BYTES).includes(file.type)) {
    throw new Error(`Invalid MIME type: ${file.type}`);
  }

  // 4. Verify magic bytes
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const expectedBytes = MAGIC_BYTES[file.type];

  if (!expectedBytes) {
    throw new Error(`No signature defined for: ${file.type}`);
  }

  for (let i = 0; i < expectedBytes.length; i++) {
    if (bytes[i] !== expectedBytes[i]) {
      throw new Error(
        `File signature mismatch. Expected ${file.type} but got different signature.`
      );
    }
  }
}

/**
 * Generate a safe filename using UUID
 * Prevents path traversal and preserves extension
 */
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  const uuid = crypto.randomUUID();
  return `${uuid}.${ext}`;
}

/**
 * Sanitize filename by removing dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, "");
  // Remove null bytes
  safe = safe.replace(/\0/g, "");
  // Keep only safe characters
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, "_");
  return safe;
}
