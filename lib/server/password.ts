import crypto from "node:crypto";

// Параметры scrypt по рекомендации OWASP; хранятся в самом хеше, чтобы их можно было поднять позже
const SCRYPT = { N: 16384, r: 8, p: 1, keyLength: 64, saltLength: 16 };
const MAX_MEMORY = 64 * 1024 * 1024;

function scrypt(password: string, salt: Buffer, keyLength: number, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, { N, r, p, maxmem: MAX_MEMORY }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

/** Формат: scrypt$N$r$p$соль$хеш (base64). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SCRYPT.saltLength);
  const key = await scrypt(password, salt, SCRYPT.keyLength, SCRYPT.N, SCRYPT.r, SCRYPT.p);
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, N, r, p, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length, Number(N), Number(r), Number(p));
  return crypto.timingSafeEqual(actual, expected);
}

// Проверка против этого хеша, когда email не найден: ответ занимает столько же времени,
// и по задержке нельзя понять, зарегистрирован ли адрес
let dummyHash: Promise<string> | undefined;
export function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword(crypto.randomBytes(16).toString("hex"));
  return dummyHash;
}
