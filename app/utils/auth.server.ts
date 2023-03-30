import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function getPasswordHash(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword({ password, hash }: { password: string, hash: string }) {
  return await bcrypt.compare(password, hash)
}
