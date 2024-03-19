import { BaseContract, BaseContractOptions } from './BaseContract';
import { Amount, Gas, MultiTransaction, NftSupplyForOwnerArgs } from 'multi-transaction';
import {
  NftApproveOptions,
  NftRedeemOptions,
  NftRevokeOptions,
  NftTransferOptions,
  NftUnregisterOptions,
} from '../types/change-options';
import {
  GetControllerCodeViewsOptions,
  GetLatestControllerCodeHashOptions,
  GetLatestControllerCodeOptions,
  GetMintFeeOptions,
  GetMintNumOptions,
  GetRoyaltyOptions,
  NftRegistrantIdsOfOptions,
  NftGetMinterIdOptions,
  NftNameSkyTokenOptions,
  NftNameSkyTokensForOwnerOptions,
  NftNameSkyTokensOptions,
  NftStateOptions,
  NftSupplyForOwnerOptions,
  NftTotalSupplyOptions,
  NftRegistrantIdsOptions,
} from '../types/view-options';
import { ControllerCodeView, NameSkyToken, RoyaltyView, TokenState } from '../types/data';
import { NameSkySigner } from '../NameSkySigner';
import {
  GetMintNumArgs,
  NftGetMinterIdArgs,
  NftNameSkyTokenArgs,
  NftNameSkyTokensArgs,
  NftNameSkyTokensForOwnerArgs,
  NftRedeemArgs,
  NftRegistrantIdsArgs,
  NftRegistrantIdsOfArgs,
  NftStateArgs,
  NftUnregisterArgs,
} from '../types/args';

export type CoreContractOptions = BaseContractOptions & {};

export class CoreContract extends BaseContract {
  constructor(options: CoreContractOptions) {
    super(options);
  }

  /**
   * Connect to new signer and return new instance
   */
  connect(signer: NameSkySigner): CoreContract {
    return new CoreContract({
      contractId: this.contractId,
      signer,
    });
  }

  // ------------------------------------------------- View -------------------------------------------------------

  async nftGetMinterId({ registrantId, blockQuery }: NftGetMinterIdOptions): Promise<string | undefined> {
    return this.signer.view<string | undefined, NftGetMinterIdArgs>({
      contractId: this.contractId,
      methodName: 'nft_get_minter_id',
      args: {
        registrant_id: registrantId,
      },
      blockQuery,
    });
  }

  async nftRegistrantIdsOf({ minterId, fromIndex, limit, blockQuery }: NftRegistrantIdsOfOptions): Promise<string[]> {
    return this.signer.view<string[], NftRegistrantIdsOfArgs>({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids_of',
      args: {
        minter_id: minterId,
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftRegistrantIds({ fromIndex, limit, blockQuery }: NftRegistrantIdsOptions): Promise<string[]> {
    return this.signer.view<string[], NftRegistrantIdsArgs>({
      contractId: this.contractId,
      methodName: 'nft_registrant_ids',
      args: {
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftState({ tokenId, blockQuery }: NftStateOptions): Promise<TokenState | undefined> {
    return this.signer.view<TokenState | undefined, NftStateArgs>({
      contractId: this.contractId,
      methodName: 'nft_state',
      args: {
        token_id: tokenId,
      },
      blockQuery,
    });
  }

  async nftNameSkyToken({ tokenId, blockQuery }: NftNameSkyTokenOptions): Promise<NameSkyToken | undefined> {
    return this.signer.view<NameSkyToken | undefined, NftNameSkyTokenArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_token',
      args: {
        token_id: tokenId,
      },
      blockQuery,
    });
  }

  async nftNameSkyTokens({ fromIndex, limit, blockQuery }: NftNameSkyTokensOptions): Promise<NameSkyToken[]> {
    return this.signer.view<NameSkyToken[], NftNameSkyTokensArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens',
      args: {
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftNameSkyTokensForOwner({
    accountId,
    fromIndex,
    limit,
    blockQuery,
  }: NftNameSkyTokensForOwnerOptions): Promise<NameSkyToken[]> {
    return this.signer.view<NameSkyToken[], NftNameSkyTokensForOwnerArgs>({
      contractId: this.contractId,
      methodName: 'nft_namesky_tokens_for_owner',
      args: {
        account_id: accountId,
        from_index: fromIndex,
        limit,
      },
      blockQuery,
    });
  }

  async nftSupplyForOwner({ accountId, blockQuery }: NftSupplyForOwnerOptions): Promise<string> {
    return this.signer.view<string, NftSupplyForOwnerArgs>({
      contractId: this.contractId,
      methodName: 'nft_supply_for_owner',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  async nftTotalSupply({ blockQuery }: NftTotalSupplyOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'nft_total_supply',
      blockQuery,
    });
  }

  async getLatestControllerCode({ blockQuery }: GetLatestControllerCodeOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code',
      blockQuery,
    });
  }

  async getLatestControllerCodeHash({ blockQuery }: GetLatestControllerCodeHashOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_latest_controller_code_hash',
      blockQuery,
    });
  }

  async getControllerCodeViews({ blockQuery }: GetControllerCodeViewsOptions): Promise<ControllerCodeView[]> {
    return this.signer.view<ControllerCodeView[]>({
      contractId: this.contractId,
      methodName: 'get_controller_code_views',
      blockQuery,
    });
  }

  async getMintFee({ blockQuery }: GetMintFeeOptions): Promise<string> {
    return this.signer.view<string>({
      contractId: this.contractId,
      methodName: 'get_mint_fee',
      blockQuery,
    });
  }

  async getRoyalty({ blockQuery }: GetRoyaltyOptions): Promise<number> {
    const { royalty, divisor } = await this.signer.view<RoyaltyView>({
      contractId: this.contractId,
      methodName: 'get_royalty',
      blockQuery,
    });

    return royalty / divisor;
  }

  async getMintNum({ accountId, blockQuery }: GetMintNumOptions): Promise<string> {
    return this.signer.view<string, GetMintNumArgs>({
      contractId: this.contractId,
      methodName: 'get_mint_num',
      args: {
        account_id: accountId,
      },
      blockQuery,
    });
  }

  // -------------------------------------------------- Change -----------------------------------------------------

  async nftUnregister({ registrantId, publicKey, force, callbackUrl }: NftUnregisterOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<NftUnregisterArgs>({
      methodName: 'nft_unregister',
      args: {
        registrant_id: registrantId,
        public_key: publicKey,
        force,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async nftRedeem({ tokenId, publicKey, force, memo, callbackUrl }: NftRedeemOptions): Promise<boolean> {
    const mTx = MultiTransaction.batch(this.contractId).functionCall<NftRedeemArgs>({
      methodName: 'nft_redeem',
      args: {
        token_id: tokenId,
        public_key: publicKey,
        force,
        memo,
      },
      attachedDeposit: Amount.ONE_YOCTO,
      gas: Gas.parse(100, 'T'),
    });

    return this.signer.send(mTx, { callbackUrl, throwReceiptErrors: true });
  }

  async nftTransfer({ tokenId, receiverId, approvalId, memo, callbackUrl }: NftTransferOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_transfer({
      args: {
        token_id: tokenId,
        receiver_id: receiverId,
        approval_id: approvalId,
        memo,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nftApprove({ tokenId, accountId, msg, callbackUrl }: NftApproveOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_approve({
      args: {
        token_id: tokenId,
        account_id: accountId,
        msg,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }

  async nftRevoke({ tokenId, accountId, callbackUrl }: NftRevokeOptions) {
    const mTx = MultiTransaction.batch(this.contractId).nonFungibleToken.nft_revoke({
      args: {
        token_id: tokenId,
        account_id: accountId,
      },
    });

    await this.signer.send(mTx, { callbackUrl });
  }
}
