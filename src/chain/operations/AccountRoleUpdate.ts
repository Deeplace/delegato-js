import { ChainArray, ChainAsset, ChainInt64, ChainObjectId, ChainUInt8, Role } from "..";
import Operation from "../Operation";

type AccountRoleUpdateProps = {
  account: string,
  admin: string,
  roles: Role[],
};

type AccountRoleUpdateChainProps = {
  admin: ChainObjectId,
  account: ChainObjectId,
  roles: ChainArray<ChainUInt8>,
};

/**
 * Updates roles of specified account.
 *
 * Transaction containing this operation should be signed by owner key and can be performed by administrator only.
 */
export default class AccountRoleUpdate extends Operation<AccountRoleUpdateChainProps> {
  constructor(props: AccountRoleUpdateProps) {
    super(0x02, {
      fee: new ChainAsset({
        amount: ChainInt64.fromValue(0),
        assetId: ChainObjectId.fromValue('1.3.0'),
      }),
      feePayingAccount: ChainObjectId.fromValue('1.2.0'),
    }, {
      admin: ChainObjectId.fromValue(props.admin),
      account: ChainObjectId.fromValue(props.account),
      roles: ChainArray.fromValue(props.roles.map(v => ChainUInt8.fromValue(v))),
    });
  }
}