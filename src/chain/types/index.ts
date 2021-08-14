import { ValidationError } from '..';
import ChainArray from './Array';
import ChainAsset from './Asset';
import ChainBoolean from './Boolean';
import { ChainBytes, ChainFixedBytes } from './Bytes';
import ChainInt64 from './Int64';
import ChainMap from './Map';
import ChainObjectId from './ObjectId';
import PrivateKey from './PrivateKey';
import PublicKey from './PublicKey';
import ChainString from './String';
import ChainTime from './Time';
import ChainUInt16 from './UInt16';
import ChainUInt32 from './UInt32';
import ChainUInt64 from './UInt64';
import ChainUInt8 from './UInt8';

// Initialization of regexp to check byte sequence string.
const bytesRegexp = /^([0-9a-fA-F]{2})+$/;

/**
 * Checks if given string is byte sequence.
 *
 * @param {string} bytes String of byte sequence.
 */
function assertBytes(bytes: string): void;

/**
 * Checks if given string is byte sequence of specified length.
 *
 * @param {string} bytes String of byte sequence.
 * @param {number} length Byte sequence length.
 */
function assertBytes(bytes: string, length: number): void;

function assertBytes(bytes: string, length?: number): void {
  if (length !== undefined && bytes.length !== length * 2) {
    throw new ValidationError(`Invalid string length. Expected value "${length * 2}", "${bytes.length}" given.`);
  }
  if (!bytesRegexp.test(bytes)) {
    throw new ValidationError('Given string is not a byte sequence.');
  }
}

/**
 * Type of blockchain key.
 */
export enum PrivateKeyType {
  active = 'active',
  owner = 'owner',
};

export enum Language {
  russian = 0,
  romanian = 1,
  english = 2,
};

export enum Role {
  admin = 255,
  citizen = 0,
  organizer = 1,
};

/**
 * Represents data type which can be serialized to binary format.
 */
export interface ISerializable<T> {
  /**
   * Gets JSON value of this object.
   */
  value(): T;

  /**
   * Gets byte representation of this object.
   */
  bytes(): string;
}

/**
 * Represents any blockchain type.
 */
export type ChainType = ISerializable<any>;

/**
 * Represents a collection which is ordered and unchangeable.
 */
export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };

/**
 * Represents a collection which is unordered, changeable and does not allow duplicates. Dictionary stores data values in key:value pairs.
 */
export type Dictionary<TKey extends string | number, TValue> = { [key in TKey]: TValue };

export type IncompleteDictionary<TKey extends string | number, TValue> = { [key in TKey]?: TValue };

export { assertBytes, ChainAsset, ChainBoolean, ChainArray, ChainMap, ChainBytes, ChainFixedBytes, ChainObjectId, PrivateKey, PublicKey, ChainString, ChainInt64, ChainUInt8, ChainUInt16, ChainUInt32, ChainUInt64, ChainTime };
