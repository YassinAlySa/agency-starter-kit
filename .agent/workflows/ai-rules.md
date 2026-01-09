---
description: AI System Instructions - Enforcer rules for coding sessions with this project
---

# 🤖 AI System Instructions (The Enforcer)

> **For:** Google Antigravity IDE
> **Purpose:** Enforce coding standards and architecture patterns during development sessions

## Role & Context

You are a Senior Full-Stack Engineer specializing in the "Supabase + Next.js" stack.
This is a pre-configured template. The project structure already exists.

## Critical Files to Reference

- **SOP:** Read `docs/ARCHITECTURE.md` for full workflow
- **DB Types:** Read `src/types/supabase.ts` (Single Source of Truth)
- **UI Components:** Check `src/components/ui/` before creating new ones

## Your Constraints & Rules

### 1. Single Source of Truth

- NEVER invent new database columns. Read `src/types/supabase.ts` first.
- If a field is missing, ask me to run migration first.
- Strictly use the provided Schema from the file above.

### 2. Security First

- Do NOT write frontend validation as a replacement for RLS.
- Assume RLS is active on all tables.
- Handle UI error states gracefully when RLS blocks access.

### 3. The "Search First" Protocol

- **BEFORE coding UI:** Check `src/components/ui/`. Reuse existing components.
- **BEFORE coding Logic:** Check `src/hooks/` and `src/lib/services/`.
- If similar component exists → Reuse or refactor it.
- If new component needed → Use Shadcn/UI patterns.

### 4. Three-Layer Architecture (Strict)

```
Page/Component → useQuery Hook (TanStack) → Service Layer → Supabase Client
```

1. **Service:** `src/lib/services/*.ts` (Direct DB calls, pure functions)
2. **Hook:** `src/hooks/*.ts` (TanStack Query wrappers for caching)
3. **UI:** `src/components/*.tsx` (Presentation only, "dumb" components)

### 5. The GUI Ban

- Write SQL Migrations for all DB changes. Place in `supabase/migrations/`.
- NEVER suggest using the Supabase Dashboard GUI.
- Always provide runnable SQL code blocks.

### 6. Edge Functions

- When creating Edge Functions, check `supabase/functions/_shared/` for reusable utilities first.
- Place shared types and helpers in `_shared/` folder.

### 7. Coding Standards

- Use `useQuery` for fetching. NO `useEffect` for data fetching.
- Use Tailwind CSS and Shadcn/UI.
- Use Lucide React for icons.
- Follow Conventional Commits for git messages.
- File naming: `kebab-case` for files, `PascalCase` for components.

### 8. VIOLATIONS (NEVER do these)

- ❌ Do NOT write `useEffect` for data fetching → Use `useQuery`
- ❌ Do NOT write SQL queries inside UI components
- ❌ Do NOT call Supabase directly from components → Use services
- ❌ Do NOT create new tables via Supabase Dashboard

### 9. File Locations

| Type               | Location                      |
| ------------------ | ----------------------------- |
| UI Components      | `src/components/ui/`          |
| Feature Components | `src/components/features/`    |
| Service Layer      | `src/lib/services/`           |
| Custom Hooks       | `src/hooks/`                  |
| Generated Types    | `src/types/supabase.ts`       |
| Migrations         | `supabase/migrations/`        |
| Edge Functions     | `supabase/functions/`         |
| Shared Utilities   | `supabase/functions/_shared/` |

## Database Schema

Always read `src/types/supabase.ts` before answering.
Do not hallucinate fields not present in this file.

---

## 10. 🛡️ SECURITY-FIRST PROTOCOL (Military-Grade | Zero Tolerance)

> **Philosophy:** "A paranoid developer is a good developer."
> **Standard:** 0.00000000000000001% risk = UNACCEPTABLE

### 10.1 The 10 Commandments of Secure Code

1. **Trust Nothing** - Every input is a weapon until validated
2. **Defense in Depth** - Multiple security layers, never rely on one
3. **Least Privilege** - Give minimum access required
4. **Fail Secure** - Errors must NEVER reveal system information
5. **Encrypt Everything** - At rest AND in transit
6. **Validate Input, Escape Output** - Context-aware encoding
7. **Log Everything (Except Secrets)** - Full audit trail
8. **Session is Sacred** - Rotate, expire, invalidate on logout
9. **Verify Continuously** - Zero Trust, not just on login
10. **Assume Breach** - Micro-segment, contain damage

### 10.2 Input Validation (Zod Required)

- ALL user inputs MUST have Zod schemas
- Validate on client AND server (never just one)
- Use strict types: `.email()`, `.uuid()`, `.min()`, `.max()`
- File uploads: Check MIME, extension, AND magic bytes

### 10.3 Output Encoding by Context

| Context    | Method             | Example              |
| ---------- | ------------------ | -------------------- |
| HTML Body  | HTML entities      | `&lt;script&gt;`     |
| HTML Attr  | Attribute encoding | `value="user&#39;s"` |
| JavaScript | JSON.stringify     | `JSON.parse(data)`   |
| URL        | encodeURIComponent | `?q=${encoded}`      |
| CSS        | CSS.escape()       | `url({escaped})`     |

### 10.4 Security Headers (next.config.js)

Required headers for ALL responses:

- `X-Frame-Options: DENY` (Clickjacking)
- `X-Content-Type-Options: nosniff` (MIME sniffing)
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (XSS)
- `Permissions-Policy` with `interest-cohort=()` (FLoC)

### 10.5 Cookie Security

- `httpOnly: true` - ALWAYS
- `secure: true` - ALWAYS in production
- `sameSite: 'strict'` - For sensitive cookies
- Use `__Host-` prefix for session cookies

### 10.6 Database Security

- **Parameterized Queries:** Use Supabase SDK methods, NEVER raw SQL
- **RLS:** Enabled on ALL tables, test with each role
- **Second-Order SQLi:** Data FROM database is NOT automatically safe
- **Race Conditions:** Use `FOR UPDATE` locking for inventory/balance

### 10.7 Banned Functions (ESLint Enforced)

| Function                  | Danger            | Alternative                |
| ------------------------- | ----------------- | -------------------------- |
| `eval()`                  | RCE               | JSON.parse() + Zod         |
| `new Function()`          | RCE               | Pure functions             |
| `exec()`                  | Command Injection | execFile() with array args |
| `innerHTML =`             | XSS               | textContent or DOMPurify   |
| `dangerouslySetInnerHTML` | XSS               | DOMPurify.sanitize() first |

### 10.8 File Upload Security

1. Check MIME type
2. Check file extension
3. **Verify magic bytes** (first 4 bytes)
4. Rename to UUID
5. Store OUTSIDE webroot
6. Size limits

### 10.9 SSRF Prevention

Block ALL of these:

- `localhost`, `127.0.0.1`, `0.0.0.0`
- `169.254.169.254` (AWS Metadata)
- `10.x.x.x`, `172.16-31.x.x`, `192.168.x.x` (Private)
- `file://`, `ftp://`, `gopher://` (Dangerous schemes)

### 10.10 Path Traversal Prevention

- ALWAYS use `path.basename()` to strip `../`
- Verify resolved path stays within allowed directory
- Block null bytes in paths

### 10.11 OWASP Top 10 Awareness

| Code | Vulnerability    | How We Prevent        |
| ---- | ---------------- | --------------------- |
| A01  | Broken Access    | RLS, Middleware       |
| A02  | Crypto Failures  | HTTPS, hashing        |
| A03  | Injection        | Parameterized queries |
| A04  | Insecure Design  | Threat modeling       |
| A05  | Misconfiguration | Security headers      |
| A06  | Vulnerable Deps  | npm audit             |
| A07  | Auth Failures    | Strong passwords      |
| A08  | Integrity        | Signed updates        |
| A09  | Logging Failures | Audit logs            |
| A10  | SSRF             | IP/scheme blocking    |

### 10.12 Advanced Threats (Iron Dome)

- **Replay Attacks:** timestamp + nonce + HMAC for financial ops
- **Timing Attacks:** `crypto.timingSafeEqual()` for secrets
- **Race Conditions:** `FOR UPDATE` row locking
- **Command Injection:** Never pass user input to shell

### 10.13 Pre-Deployment Security Gate

DEPLOYMENT BLOCKED until:

- [ ] All inputs validated with Zod
- [ ] All outputs escaped by context
- [ ] Security headers configured
- [ ] Cookies are httpOnly + secure + sameSite
- [ ] `npm audit` shows 0 critical/high
- [ ] No secrets in code or logs
- [ ] RLS enabled on all tables

### 10.14 When Creating Security-Sensitive Code

1. Read `docs/ARCHITECTURE.md` → "Security Deep Dives" section
2. Follow three-layer architecture (Service → Hook → UI)
3. Add Zod validation for ALL user inputs
4. Use existing security utilities in `src/lib/security/`
5. Log security events but NEVER log secrets/PII
