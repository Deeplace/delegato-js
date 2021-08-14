import { PrivateKey, PublicKey } from "../../chain";
import Token from "../../chain/jwt/Token";
import Storage from "./Storage";

export default class LocalStorage extends Storage {
  private _token?: Token | null;
  private _activePrivateKey?: PrivateKey | null;
  private _ownerPrivateKey?: PrivateKey | null;
  private _activePublicKey?: PublicKey | null;
  private _ownerPublicKey?: PublicKey | null;

  constructor() {
    super();
  }

  /**
   * {@inheritdoc}
   */
  public get token(): Token | null {
    if (this._token === undefined) {
      let token = window.localStorage.getItem('token');
      if (token === null) {
        this._token = null;
      }
      else {
        try {
          this._token = Token.fromBase64(token);
        }
        catch (error) {
          this._token = null;
        }
      }
    }
    return this._token;
  }

  /**
   * {@inheritdoc}
   */
  public set token(token: Token | null) {
    if (token === null) {
      window.localStorage.removeItem('token');
    }
    else {
      window.localStorage.setItem('token', token.base64());
    }
    this._token = token;
  }

  /**
   * {@inheritdoc}
   */
  public get activePrivateKey(): PrivateKey | null {
    if (this._activePrivateKey === undefined) {
      let activePrivateKey = window.localStorage.getItem('activePrivateKey');
      if (activePrivateKey === null) {
        this._activePrivateKey = null;
      }
      else {
        try {
          this._activePrivateKey = PrivateKey.fromWif(activePrivateKey);
        }
        catch (error) {
          this._activePrivateKey = null;
        }
      }
    }
    return this._activePrivateKey;
  }

  /**
   * {@inheritdoc}
   */
  public set activePrivateKey(pk: PrivateKey | null) {
    if (pk === null) {
      window.localStorage.removeItem('activePrivateKey');
    }
    else {
      window.localStorage.setItem('activePrivateKey', pk.wif());
    }
    this._activePrivateKey = pk;
  }

  /**
   * {@inheritdoc}
   */
  public get ownerPrivateKey(): PrivateKey | null {
    if (this._ownerPrivateKey === undefined) {
      let ownerPrivateKey = window.localStorage.getItem('ownerPrivateKey');
      if (ownerPrivateKey === null) {
        this._ownerPrivateKey = null;
      }
      else {
        try {
          this._ownerPrivateKey = PrivateKey.fromWif(ownerPrivateKey);
        }
        catch (error) {
          this._ownerPrivateKey = null;
        }
      }
    }
    return this._ownerPrivateKey;
  }

  /**
   * {@inheritdoc}
   */
  public set ownerPrivateKey(pk: PrivateKey | null) {
    if (pk === null) {
      window.localStorage.removeItem('ownerPrivateKey');
    }
    else {
      window.localStorage.setItem('ownerPrivateKey', pk.wif());
    }
    this._ownerPrivateKey = pk;
  }

  /**
   * {@inheritdoc}
   */
  public get activePublicKey(): PublicKey | null {
    if (this._activePublicKey === undefined) {
      let activePublicKey = window.localStorage.getItem('activePublicKey');
      if (activePublicKey === null) {
        this._activePublicKey = null;
      }
      else {
        try {
          this._activePublicKey = PublicKey.fromWif(activePublicKey);
        }
        catch (error) {
          this._activePublicKey = null;
        }
      }
    }
    return this._activePublicKey;
  }

  /**
   * {@inheritdoc}
   */
  public set activePublicKey(pk: PublicKey | null) {
    if (pk === null) {
      window.localStorage.removeItem('activePublicKey');
    }
    else {
      window.localStorage.setItem('activePublicKey', pk.wif());
    }
    this._activePublicKey = pk;
  }

  /**
   * {@inheritdoc}
   */
  public get ownerPublicKey(): PublicKey | null {
    if (this._ownerPublicKey === undefined) {
      let ownerPublicKey = window.localStorage.getItem('ownerPublicKey');
      if (ownerPublicKey === null) {
        this._ownerPublicKey = null;
      }
      else {
        try {
          this._ownerPublicKey = PublicKey.fromWif(ownerPublicKey);
        }
        catch (error) {
          this._ownerPublicKey = null;
        }
      }
    }
    return this._ownerPublicKey;
  }

  /**
   * {@inheritdoc}
   */
  public set ownerPublicKey(pk: PublicKey | null) {
    if (pk === null) {
      window.localStorage.removeItem('ownerPublicKey');
    }
    else {
      window.localStorage.setItem('ownerPublicKey', pk.wif());
    }
    this._ownerPublicKey = pk;
  }

}