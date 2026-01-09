/**
 * SSRF Prevention Utilities
 * Based on ARCHITECTURE.md Security Deep Dives
 * 
 * Prevents Server-Side Request Forgery attacks
 */

// Blocked hostnames
const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "169.254.169.254", // AWS Metadata
  "metadata.google.internal", // GCP Metadata
  "metadata.azure.com", // Azure Metadata
];

// Private IP ranges (regex patterns)
const BLOCKED_IP_RANGES = [
  /^10\./, // 10.0.0.0 - 10.255.255.255
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0 - 172.31.255.255
  /^192\.168\./, // 192.168.0.0 - 192.168.255.255
  /^127\./, // Loopback
  /^0\./, // Invalid
  /^169\.254\./, // Link-local
  /^::1$/, // IPv6 loopback
  /^fc00:/, // IPv6 private
  /^fe80:/, // IPv6 link-local
];

// Dangerous URL schemes
const BLOCKED_SCHEMES = ["file:", "ftp:", "gopher:", "dict:", "ldap:"];

/**
 * Validate that a URL is safe to fetch
 * @throws Error if URL is blocked
 */
export function validateExternalUrl(urlString: string): boolean {
  let url: URL;
  
  try {
    url = new URL(urlString);
  } catch {
    throw new Error("Invalid URL format");
  }

  // Check scheme
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Blocked protocol: ${url.protocol}`);
  }

  // Check for blocked schemes in URL
  for (const scheme of BLOCKED_SCHEMES) {
    if (urlString.toLowerCase().includes(scheme)) {
      throw new Error(`Blocked scheme detected: ${scheme}`);
    }
  }

  // Check blocked hosts
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    throw new Error(`Blocked host: ${hostname}`);
  }

  // Check private IP ranges
  for (const pattern of BLOCKED_IP_RANGES) {
    if (pattern.test(hostname)) {
      throw new Error(`Private IP range blocked: ${hostname}`);
    }
  }

  return true;
}

/**
 * Check if a URL is an internal/private URL
 */
export function isInternalUrl(urlString: string): boolean {
  try {
    validateExternalUrl(urlString);
    return false;
  } catch {
    return true;
  }
}
