import * as bcrypt from 'bcrypt';

export class EncryptionHelper {

  /**
   * Encrypt password
   *
   * @param password
   * @returns string
   */
  public static encrypt(password) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  /**
   * Decrypt password
   *
   * @param password
   * @param hash
   * @returns boolean
   */
  public static compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
