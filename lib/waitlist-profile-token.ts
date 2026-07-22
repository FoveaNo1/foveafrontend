import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = 1;
const TOKEN_TTL_MS = 15 * 60 * 1000;
const MIN_SIGNING_SECRET_BYTES = 32;

type ProfileTokenPayload = {
  email: string;
  expiresAt: number;
  nonce: string;
  version: number;
};

function getSigningSecret() {
  const secret = process.env.WAITLIST_PROFILE_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < MIN_SIGNING_SECRET_BYTES) return null;
  return secret;
}

export function isWaitlistProfileTokenConfigured() {
  return getSigningSecret() !== null;
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(`waitlist-profile-v1:${encodedPayload}`).digest("base64url");
}

export function issueWaitlistProfileToken(email: string) {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload: ProfileTokenPayload = {
    email,
    expiresAt: Date.now() + TOKEN_TTL_MS,
    nonce: randomBytes(16).toString("base64url"),
    version: TOKEN_VERSION,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyWaitlistProfileToken(token: string) {
  const secret = getSigningSecret();
  if (!secret || token.length > 2048) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, suppliedSignature] = parts;
  if (!encodedPayload || !suppliedSignature) return null;

  const expectedSignature = sign(encodedPayload, secret);
  const suppliedBuffer = Buffer.from(suppliedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<ProfileTokenPayload>;
    if (
      payload.version !== TOKEN_VERSION ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      typeof payload.nonce !== "string" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload.email;
  } catch {
    return null;
  }
}
