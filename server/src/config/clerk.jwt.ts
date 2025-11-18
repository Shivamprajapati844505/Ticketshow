import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import jwt, { JwtPayload } from 'jsonwebtoken';

type Jwk = {
  alg: string;
  kty: string;
  use: string;
  kid: string;
  n: string;
  e: string;
};

let cachedJwks: Jwk[] | null = null;
let cacheExpiry = 0;


const JWKS_URL =
  process.env.CLERK_JWKS_URL ||
  'https://moved-emu-21.clerk.accounts.dev/.well-known/jwks.json';

const CACHE_TTL = 1000 * 60 * 60; 

async function fetchJwks(): Promise<Jwk[]> {
  if (!JWKS_URL) throw new Error('JWKS_URL not configured');

  const now = Date.now();
  if (cachedJwks && now < cacheExpiry) return cachedJwks;

  const res = await axios.get<string>(JWKS_URL, { timeout: 5000 });
  const data: any = res.data;

  if (!data?.keys) throw new Error('Invalid JWKS response');

  cachedJwks = data.keys as Jwk[];
  cacheExpiry = now + CACHE_TTL;

  return cachedJwks;
}

export async function verifyClerkJwt(token: string): Promise<JwtPayload> {
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.decode(token, { complete: true }) as any;
  if (!decoded?.header) throw new Error('Invalid JWT');

  const kid: string | undefined = decoded.header.kid;
  const alg: string | undefined = decoded.header.alg;

  const keys = await fetchJwks();

  // TypeScript-safe JWK selection
  let jwk: Jwk | null = null;

  if (kid) {
    const found = keys.find((k) => k.kid === kid);
    if (found) jwk = found;
  }

  // fallback
  if (!jwk && keys.length > 0) {
    jwk = keys[0];
  }

  if (!jwk) throw new Error('No JWK available');

  const pem = jwkToPem(jwk);
  const payload = jwt.verify(token, pem, {
    algorithms: alg ? [alg] : ['RS256'],
  }) as JwtPayload;

  return payload;
}
