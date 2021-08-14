import { PrivateKey, PublicKey } from "../../chain";
import Token from "../../chain/jwt/Token";

export default abstract class Storage {
  public abstract get token(): Token | null;

  public abstract set token(token: Token | null);

  public abstract get activePrivateKey(): PrivateKey | null;

  public abstract set activePrivateKey(pk: PrivateKey | null);

  public abstract get ownerPrivateKey(): PrivateKey | null;

  public abstract set ownerPrivateKey(pk: PrivateKey | null);

  public abstract get activePublicKey(): PublicKey | null;

  public abstract set activePublicKey(pk: PublicKey | null);

  public abstract get ownerPublicKey(): PublicKey | null;

  public abstract set ownerPublicKey(pk: PublicKey | null);
}