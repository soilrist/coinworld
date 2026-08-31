import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from "otplib";

const ISSUER = "담이농장 DAM-E FARM OS";

function createTotp() {
  return new TOTP({ crypto: new NobleCryptoPlugin(), base32: new ScureBase32Plugin() });
}

export function generateTotpSecret(): string {
  return createTotp().generateSecret();
}

export function totpKeyUri(email: string, secret: string): string {
  return createTotp().toURI({ label: email, issuer: ISSUER, secret });
}

export async function verifyTotpCode(code: string, secret: string): Promise<boolean> {
  const result = await createTotp().verify(code, { secret, epochTolerance: 30 });
  return result.valid;
}
