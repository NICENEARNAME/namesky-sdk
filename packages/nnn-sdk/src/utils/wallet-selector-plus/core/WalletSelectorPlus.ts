import {setupWalletSelector} from "@near-wallet-selector/core";
import {resolveNetwork, setupWalletModules} from "../utils";
import {InMemorySigner, keyStores, Near} from "near-api-js";
import {WalletSelectorPlusConfig, WalletSelectorPlus, SelectorMultiSendOptions} from "../types";
import {BrowserLocalStorageKeyStore} from "near-api-js/lib/key_stores";
import {BaseArgs, MultiTransaction, SpecificFunctionViewOptions} from "../../multi-transaction";
import {parseOutcomeValue} from "../../multi-transaction";
import {MultiSendAccount} from "../../multi-send-account";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";

let walletSelectorPlus: WalletSelectorPlus | null = null;

export async function setupWalletSelectorPlus(config: WalletSelectorPlusConfig): Promise<WalletSelectorPlus> {
  if (!walletSelectorPlus) {
    const selector = await setupWalletSelector({
      ...config,
      modules: setupWalletModules(config.modules)
    })

    const near = new Near({
      ...resolveNetwork(config.network),
      keyStore: new keyStores.BrowserLocalStorageKeyStore(
        localStorage,
        config.keyStorePrefix
      )})

    walletSelectorPlus = {
      ...selector,
      near,

      getActiveAccountId(): string | undefined {
        return this.store.getState().accounts.find(accountState => accountState.active)?.accountId
      },

      getAccountIds(): string[] {
        return this.store.getState().accounts.map(accountState => accountState.accountId)
      },

      keyStore(): BrowserLocalStorageKeyStore {
        return (this.near.connection.signer as InMemorySigner).keyStore as BrowserLocalStorageKeyStore
      },

      multiSendAccount(accountId: string): MultiSendAccount {
        return new MultiSendAccount(this.near.connection, accountId)
      },

      async view<Value, Args extends BaseArgs>(options: SpecificFunctionViewOptions<Args>): Promise<Value> {
        return this.multiSendAccount('').view(options)
      },

      async multiSend<Value>(transaction: MultiTransaction, options?: SelectorMultiSendOptions): Promise<Value> {
        const wallet = await this.wallet(options?.walletId)
        const nearWalletSelectorTransactions = transaction.parseNearWalletSelectorTransactions()
        let outcome
        if (transaction.isMultiple()) {
          const outcomes = await wallet.signAndSendTransactions({
            transactions: nearWalletSelectorTransactions ,
            callbackUrl: options?.callbackUrl
          })
          outcome = (outcomes as FinalExecutionOutcome[]).pop()
        } else {
          outcome = await wallet.signAndSendTransaction({
            ...nearWalletSelectorTransactions[0],
            callbackUrl: options?.callbackUrl
          })
          outcome = outcome as FinalExecutionOutcome
        }
        return parseOutcomeValue(outcome!)
      },

      async multiSendWithLocalKey<Value>(signerID: string, transaction: MultiTransaction): Promise<Value> {
        return this.multiSendAccount(signerID).send(transaction)
      }
    }
  }

  return walletSelectorPlus
}
