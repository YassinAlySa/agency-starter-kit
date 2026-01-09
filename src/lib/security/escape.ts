/**
 * Output Encoding Utilities
 * Based on ARCHITECTURE.md Section 3.1.4
 * 
 * "Validate on input, ESCAPE on output"
 */

import DOMPurify from "dompurify";

/**
 * Escape HTML special characters
 * Use for: User text displayed in HTML body
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize rich HTML (WYSIWYG editors)
 * Use for: User-generated HTML content
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: strip all tags
    return html.replace(/<[^>]*>/g, "");
  }
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Encode for URL parameters
 * Use for: User input in query strings
 */
export function encodeUrlParam(str: string): string {
  return encodeURIComponent(str);
}

/**
 * Escape for JavaScript context
 * Use for: Embedding user data in script blocks
 */
export function escapeForJs(str: string): string {
  return JSON.stringify(str);
}

/**
 * Escape for CSS context
 * Use for: User input in CSS values
 */
export function escapeCss(str: string): string {
  if (typeof CSS !== "undefined" && CSS.escape) {
    return CSS.escape(str);
  }
  // Fallback: remove dangerous characters
  return str.replace(/[^a-zA-Z0-9-_]/g, "");
}
