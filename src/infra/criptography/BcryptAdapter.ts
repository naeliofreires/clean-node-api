import bcrypt from 'bcrypt'
import { type IEncrypter } from '../../data/protocols/encrypter'

export class BcrypterAdapter implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, 10)
  };
}
