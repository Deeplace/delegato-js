import BigInteger from "bigi";
import { decode, encode } from "bs58";
import { getCurveByName } from "ecurve";
import { Dictionary, ISerializable, PrivateKeyType, PublicKey, ValidationError } from "..";
import { normalizeBrainKey, sha256 } from "../../ecc";

const secp256k1 = getCurveByName("secp256k1");

/**
 * The private key. This key must be kept in secret.
 */
export default class PrivateKey implements ISerializable<string> {

  //#region ~Fields~

  public readonly d: BigInteger;

  /**
   * Cached public key of this private key.
   */
  private _publicKey?: PublicKey;

  //#endregion

  //#region ~Properties~

  /**
   * Public key of this private key.
   */
  get publicKey() {
    if (this._publicKey) {
      return this._publicKey;
    }
    return (this._publicKey = PublicKey.fromPoint(secp256k1.G.multiply(this.d)));
  }

  //#endregion

  //#region ~Constructor~

  constructor(d: BigInteger) {
    this.d = d;
  }

  //#endregion

  //#region ~ISerializable~

  value(): string {
    return this.wif();
  }

  bytes(): string {
    return this.d.toHex();
  }

  //#endregion

  //#region ~Methods~

  /**
   * Gets representation of this private key in wallet import format.
   *
   * @returns {string} Representation of private key in wallet import format.
   */
  wif(): string {
    let pk = Buffer.from(`80${this.bytes()}`, 'hex');
    // Checksum includes the version.
    let checksum = sha256(pk);
    checksum = sha256(checksum);
    checksum = checksum.slice(0, 4);
    return encode(Buffer.concat([pk, checksum]));
  }

  //#endregion

  //#region ~Static methods~

  /**
   * Creates instance of PrivateKey object using its value.
   *
   * @param {string} value Value to create instance of PrivateKey object.
   *
   * @returns {PrivateKey} New instance of PrivateKey object.
   */
  static fromValue(value: string): PrivateKey {
    return PrivateKey.fromWif(value);
  }

  /**
   * Creates instance of PrivateKey object using its byte representation.
   *
   * @param {string} bytes Bytes to create instance of PrivateKey object.
   *
   * @returns {PrivateKey} New instance of PrivateKey object.
   */
  static fromBytes(bytes: string): PrivateKey {
    return new PrivateKey(BigInteger.fromHex(bytes));
  }

  /**
   * Creates instance of PrivateKey from wallet import format.
   *
   * @param {string} wif Value in wallet import format to create instance of PrivateKey object.
   *
   * @returns {PrivateKey} New instance of PrivateKey object.
   */
  static fromWif(wif: string): PrivateKey {
    let b = Buffer.from(decode(wif));
    let version = b.readUInt8(0);
    if (version !== 0x80) {
      throw new ValidationError(`Wrong version. Expected value "${0x80}, "${version}" given.`);
    }
    // Checksum includes the version.
    let pk = b.slice(0, -4);
    let checksum = b.slice(-4);
    let newChecksum = sha256(pk);
    newChecksum = sha256(newChecksum);
    newChecksum = newChecksum.slice(0, 4);
    if (checksum.toString('hex') !== newChecksum.toString('hex')) {
      throw new ValidationError("Checksum did not match.");
    }
    pk = pk.slice(1);
    return PrivateKey.fromBytes(pk.toString('hex'));
  }

  /**
   * Creates instance of PrivateKey from seed.
   *
   * @param {string} seed Seed to create instance of PrivateKey object.
   *
   * @returns {PrivateKey} New instance of PrivateKey object.
   */
  static fromSeed(seed: string): PrivateKey {
    return PrivateKey.fromBytes(sha256(seed, 'hex'));
  }

  /**
   * Generates private key for account.
   *
   * @param {string} accountName Account name of key owner.
   * @param {string} password Password of account.
   * @param {PrivateKeyType} role Type of key to be generated. Can be "active" or "owner".
   *
   * @returns {PrivateKey} Generated key for specified account.
   */
  static create(accountName: string, password: string, role: PrivateKeyType): PrivateKey;

  /**
   * Generates private keys for account.
   *
   * @param {string} accountName Account name of key owner.
   * @param {string} password Password of account.
   * @param {PrivateKeyType} roles  Set of types of keys to be generated. Key type can be "active" or "owner".
   *
   * @returns {PrivateKey} Generated keys for specified account of each key type.
   */
  static create(accountName: string, password: string, roles: Set<PrivateKeyType>): Dictionary<PrivateKeyType, PrivateKey>;

  static create(accountName: string, password: string, roles: Set<PrivateKeyType> | PrivateKeyType) {
    if (password.length < 12) {
      throw new ValidationError("Password must have at least 12 characters.");
    }

    if (roles instanceof Set) {
      return Array.from(roles.keys()).reduce((previous, role) => {
        let key = PrivateKey.fromSeed(normalizeBrainKey(`${accountName}${role}${password}`));
        return { ...previous, role, key }
      }, {});
    }
    return PrivateKey.fromSeed(normalizeBrainKey(`${accountName}${roles}${password}`));
  }

  //#endregion

}
