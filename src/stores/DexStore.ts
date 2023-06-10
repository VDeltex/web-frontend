import { AbstractStore, TokenLikeModel, TvmWalletService, useRpcClient, useRpcProvider } from "@broxus/js-core";
import { useWalletsCache } from "@broxus/react-modules";
import { makeObservable } from "mobx";
import { DexUtils } from "./utils";
import { DexCluster } from "@/abi/types";
import { Address } from "everscale-inpage-provider";
import BigNumber from "bignumber.js";
import { SwapStore } from "./SwapStore";
import { ROOT } from "@/config";
import { DexClusterContract } from "./contracts";
import { LiquidityStore } from "./LiquidityStore";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { appRoutes } from "@/routes";

type DexStoreState = {
}

export type marketsOptions = {

}

type DexStoreData = {
    pools: DexCluster;
    swap: SwapStore;
    liquidity: LiquidityStore;
}


export class DexStore extends AbstractStore<
    DexStoreData,
    DexStoreState
> {

    protected rpc = useRpcProvider()
    protected walletsCache = useWalletsCache(this.rpc)
    public static Utils = DexUtils

    constructor(
        public readonly wallet: TvmWalletService,
        public readonly history: any,
    ) {
        super()
        makeObservable(this)
    }

    public async weightedPools() {
        const pools = await DexStore.Utils._weightedPools()
        this.setData('pools', pools)
    }

    public async getNameToken(addressToken: Address, iPool: number, iToken: number) {
        const pools = this._data.pools
        const name = await DexStore.Utils._getName(addressToken);
        const decimals = await DexStore.Utils._getDecimals(addressToken);
        // const wallet = await DexStore.Utils._getWallet(this.wallet.account?.address!, addressToken);

        const balanceTakingDecimals = new BigNumber(pools[iPool][1].tokens[iToken].balance).shiftedBy(-decimals).toFixed()
        //@ts-ignore
        pools[iPool][1].tokens[iToken].name = name
        //@ts-ignore
        pools[iPool][1].tokens[iToken].decimals = decimals
        //@ts-ignore
        pools[iPool][1].tokens[iToken].balanceTakingDecimals = balanceTakingDecimals
        //@ts-ignore
        pools[iPool][1].tvl = new BigNumber(balanceTakingDecimals).plus(pools[iPool][1].tvl ?? 0).toFixed()
        //@ts-ignore
        // pools[iPool][1].tokens[iToken].wallet = wallet
        this.setData('pools', pools);
        return name
    }
    public async calcExpectedSwap(poolId: string, inTokenId: string, outTokenId: string, amountIn: string) {
        const calc = await DexStore.Utils._calcExpectedSwap(
            poolId,
            inTokenId,
            outTokenId,
            amountIn
        )
        this.swap.setTotal(calc)
        return calc
    }

    public async sendSwap(poolId: string, inTokenId: string, outTokenId: string, call_id: string, decimals: number, tokenWallet: Address) {
        const toastId = toast.loading('Wait for the end of the swap...');
        this._data.swap.setLoading(true)
        const encode = await DexStore.Utils._encodeSwapPayload(
            poolId,
            inTokenId,
            outTokenId,
            call_id
        )
        const provider = useRpcClient('venom')
        const subscriber = new provider.Subscriber()
        const contract = DexClusterContract(ROOT)
        const successStream = await subscriber
            .transactions(ROOT)
            .flatMap(item => item.transactions)
            .flatMap(transaction => contract.decodeTransactionEvents({
                transaction,
            }))
            .filterMap(async result => {
                if (
                    result.event === 'Swap'
                    && result.data.call_id === call_id
                ) {
                    this._data.swap.setTotal("0")
                    this._data.swap.setAmount("")
                    this._data.swap.setLoading(false)
                    toast.success('The swap was successful', {
                        id: toastId,
                    });
                    return;
                }
                // this._data.swap.setTotal("0")
                // this._data.swap.setAmount("")
                // this._data.swap.setLoading(false)
                // toast.error('Error, try again', {
                //     id: toastId,
                // });
                return undefined
            })
            .delayed(s => s.first())

        await DexStore.Utils._transfer(tokenWallet, this.wallet.account?.address!, {
            remainingGasTo: this.wallet.account?.address!,
            deployWalletValue: 0,
            amount: new BigNumber(this._data.swap.amount!).shiftedBy(decimals).toFixed(),
            notify: true,
            recipient: ROOT,
            payload: encode,
        })
        await successStream()
        await subscriber.unsubscribe()
    }

    public async sendLiquidity(poolId: string, inTokenId: string, call_id: string, decimals: number, tokenWallet: Address) {
        const toastId = toast.loading('Wait for the adding liquidity...');
        this._data.liquidity.setLoading(true)
        const encode = await DexStore.Utils._encodeJoinPayload(
            poolId,
            inTokenId,
            call_id
        )
        const provider = useRpcClient('venom')
        const subscriber = new provider.Subscriber()
        const contract = DexClusterContract(ROOT)
        const successStream = await subscriber
            .transactions(ROOT)
            .flatMap(item => item.transactions)
            .flatMap(transaction => contract.decodeTransactionEvents({
                transaction,
            }))
            .filterMap(async result => {
                if (
                    result.event === 'Join'
                    && result.data.call_id === call_id
                ) {
                    this._data.liquidity.setTotal("0")
                    this._data.liquidity.setAmount("")
                    this._data.liquidity.setLoading(false)
                    toast.success('The swap was successful', {
                        id: toastId,
                    });
                    return;
                }
                // this._data.liquidity.setTotal("0")
                // this._data.liquidity.setAmount("")
                // this._data.liquidity.setLoading(false)
                // toast.error('Error, try again', {
                //     id: toastId,
                // });
                return undefined
            })
            .delayed(s => s.first())

        await DexStore.Utils._transfer(tokenWallet, this.wallet.account?.address!, {
            remainingGasTo: this.wallet.account?.address!,
            deployWalletValue: 0,
            amount: new BigNumber(this._data.liquidity.amount!).shiftedBy(decimals).toFixed(),
            notify: true,
            recipient: ROOT,
            payload: encode,
        })
        await successStream()
        await subscriber.unsubscribe()
    }

    public async addSwap(iPool: number) {
        const swap = new SwapStore(this.wallet, this._data.pools[iPool])
        this.setData('swap', swap)
    }

    public async addLiquidity(iPool: number) {
        const liquidity = new LiquidityStore(this.wallet, this._data.pools[iPool])
        this.setData('liquidity', liquidity)
    }

    public get pools() {
        return this._data.pools
    }

    public get swap() {
        return this._data.swap
    }

    public get liquidity() {
        return this._data.liquidity
    }
}