import { PrivateKey, PublicKey } from "../../chain";
import Token from "../../chain/jwt/Token";
import Storage from "./Storage";

export default class MemoryStorage extends Storage {
  constructor() {
    super();
    this.token = null;
    this.activePrivateKey = null;
    this.ownerPrivateKey = null;
    this.activePublicKey = null;
    this.ownerPublicKey = null;
  }

  public token: Token | null;
  public activePrivateKey: PrivateKey | null;
  public ownerPrivateKey: PrivateKey | null;
  public activePublicKey: PublicKey | null;
  public ownerPublicKey: PublicKey | null;
}
