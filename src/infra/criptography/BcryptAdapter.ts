import bcrypt from 'bcrypt'
import { type IEncrypter } from '../../data/protocols/encrypter'

export class BcrypterAdapter implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 10)
    return hash
  };
}
