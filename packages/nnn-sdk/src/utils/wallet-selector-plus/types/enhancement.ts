import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { WalletSelectorPlusSendOptions } from './options';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { BaseArgs, MultiTransaction, SpecificFunctionViewOptions } from '../../multi-transaction';
import { MultiSendAccount } from '../../multi-send-account';

export interface WalletSelectorEnhancement {
  near: Near;
  getActiveAccountId(): string | undefined;
  getAccountIds(): string[];
  keyStore(): BrowserLocalStorageKeyStore;
  multiSendAccount(accountId: string): MultiSendAccount;
  view<Value, Args extends BaseArgs>({
    contractId,
    methodName,
    args,
    blockQuery,
  }: SpecificFunctionViewOptions<Args>): Promise<Value>;
  send<Value>(transaction: MultiTransaction, options?: WalletSelectorPlusSendOptions): Promise<Value>;
  sendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value>;
}

/**
 * Enhancement of `NearWalletSelector` based on `MultiTransaction` and `MultiSendAccount`
 */
export type WalletSelectorPlus = Modify<WalletSelector, WalletSelectorEnhancement>;
