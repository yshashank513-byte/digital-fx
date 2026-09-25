import dns from "dns/promises";

// List of private/reserved IPv4 address ranges
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  const [a, b, c, d] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (Private network)
  if (a === 10) return true;

  // 100.64.0.0/10 (Carrier grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 169.254.0.0/16 (Link-local / Cloud Metadata e.g. AWS/GCP 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12 (Private network)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (a === 192 && b === 0 && c === 0) return true;

  // 192.0.2.0/24 (TEST-NET-1)
  if (a === 192 && b === 0 && c === 2) return true;

  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true;

  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;

  // 198.51.100.0/24 (TEST-NET-2)
  if (a === 198 && b === 51 && c === 100) return true;

  // 203.0.113.0/24 (TEST-NET-3)
  if (a === 203 && b === 0 && c === 113) return true;

  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;

  // 240.0.0.0/4 (Reserved / Future use)
  if (a >= 240) return true;

  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase().trim();

  // Loopback & Unspecified
  if (normalized === "::1" || normalized === "::") return true;

  // IPv4-mapped IPv6 addresses (::ffff:127.0.0.1 or ::ffff:7f00:1)
  if (normalized.startsWith("::ffff:") || normalized.startsWith("0:0:0:0:0:ffff:")) {
    const ipv4Part = normalized.split(":").pop();
    if (ipv4Part && ipv4Part.includes(".")) {
      return isPrivateIPv4(ipv4Part);
    }
    return true;
  }

  // Unique local addresses (fc00::/7 -> fc00 to fdff)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // Link-local addresses (fe80::/10 -> fe80 to febf)
  if (
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true;
  }

  // Multicast (ff00::/8)
  if (normalized.startsWith("ff")) return true;

  return false;
}

/**
 * Validates a target URL against SSRF attack vectors.
 * Returns safe normalized URL object or throws an error.
 */
export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  let trimmed = String(rawUrl || "").trim();
  if (!trimmed) {
    throw new Error("Target URL is required.");
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL format.");
  }

  // Only HTTP and HTTPS allowed
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Unsupported URL protocol. Only HTTP and HTTPS are permitted.");
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // Known dangerous hostnames & cloud metadata services
  const blockedHosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254",
    "metadata.google.internal",
    "instance-data",
  ];

  if (blockedHosts.includes(hostname) || hostname.endsWith(".internal") || hostname.endsWith(".local")) {
    throw new Error("Access to internal, loopback, or cloud metadata hosts is forbidden.");
  }

  // If host is an IP literal
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    if (isPrivateIPv4(hostname)) {
      throw new Error("Access to private or local IP ranges is forbidden.");
    }
  } else if (hostname.includes(":")) {
    // IPv6 literal
    const cleanIpv6 = hostname.replace(/^\[|\]$/g, "");
    if (isPrivateIPv6(cleanIpv6)) {
      throw new Error("Access to private or local IPv6 ranges is forbidden.");
    }
  } else {
    // Resolve DNS and verify all returned addresses
    try {
      const records = await dns.lookup(hostname, { all: true });
      if (!records || records.length === 0) {
        throw new Error("Hostname could not be resolved.");
      }

      for (const rec of records) {
        if (rec.family === 4 && isPrivateIPv4(rec.address)) {
          throw new Error("Host resolves to a private or restricted network address.");
        }
        if (rec.family === 6 && isPrivateIPv6(rec.address)) {
          throw new Error("Host resolves to a private or restricted network address.");
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes("private or restricted")) {
        throw err;
      }
      throw new Error(`DNS resolution failed for host: ${hostname}`);
    }
  }

  return parsed;
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  headers?: Record<string, string>;
  maxRedirects?: number;
}

export interface SafeFetchResult {
  status: number;
  statusText: string;
  ok: boolean;
  headers: Headers;
  text: string;
  finalUrl: string;
}

/**
 * SSRF-Safe HTTP GET fetcher with DNS validation, redirect checking,
 * response size limits, and timeout protection.
 */
export async function safeFetchHtml(
  rawUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const maxBytes = options.maxBytes ?? 3 * 1024 * 1024; // 3MB max HTML size
  const maxRedirects = options.maxRedirects ?? 3;

  let currentUrl = rawUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    const validatedUrl = await validateSafeUrl(currentUrl);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(validatedUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; DigitalFXSecurityAudit/1.0; +https://www.digitalfx.in)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          ...(options.headers || {}),
        },
        redirect: "manual", // Handle redirects manually to re-validate each hop against SSRF
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timer);
    }

    // If redirect, re-validate the target location
    if (
      [301, 302, 303, 307, 308].includes(response.status) &&
      response.headers.get("location")
    ) {
      redirectsCount++;
      if (redirectsCount > maxRedirects) {
        throw new Error("Too many redirects.");
      }
      const rawLocation = response.headers.get("location")!;
      // Resolve relative redirect against current URL
      currentUrl = new URL(rawLocation, validatedUrl.toString()).toString();
      continue;
    }

    // Read response stream up to maxBytes to avoid memory exhaustion (DoS)
    const reader = response.body?.getReader();
    if (!reader) {
      const text = await response.text();
      return {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: response.headers,
        text: text.slice(0, maxBytes),
        finalUrl: validatedUrl.toString(),
      };
    }

    let receivedBytes = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        receivedBytes += value.length;
        if (receivedBytes > maxBytes) {
          chunks.push(value.slice(0, maxBytes - (receivedBytes - value.length)));
          break; // Stop reading further bytes
        }
        chunks.push(value);
      }
    }

    const totalBuffer = Buffer.concat(chunks);
    const text = new TextDecoder("utf-8", { fatal: false }).decode(totalBuffer);

    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: response.headers,
      text,
      finalUrl: validatedUrl.toString(),
    };
  }

  throw new Error("Maximum redirect limit exceeded.");
}
