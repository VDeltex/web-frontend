import { AbstractStore, TokensListService, TvmWalletService, useRpcProvider } from "@broxus/js-core";
import { useWalletsCache } from "@broxus/react-modules";
import { computed, makeObservable } from "mobx";
import { DexUtils } from "./utils";

type LiquidityStoreState = {
    amount?: string;
    total?: string
    leftToken?: string
    loading?: boolean
}

type LiquidityStoreData = {
    tokens: any[]

}


export class LiquidityStore extends AbstractStore<
    LiquidityStoreData,
    LiquidityStoreState
> {

    protected rpc = useRpcProvider()
    protected walletsCache = useWalletsCache(this.rpc)
    public static Utils = DexUtils

    constructor(
        public readonly wallet: TvmWalletService,
        public readonly poll: any
    ) {
        super()
        makeObservable(this)
        this.setData('tokens', poll[1].tokens)
        this.setState('loading', false)
    }

    public get tokens() {
        return this._data.tokens
    }

    public setAmount(value: string): void {
        this.setState('amount', value)
    }


    public setLeftToken(value: string): void {
        this.setState('leftToken', value)
    }

    public setTotal(value: string): void {
        this.setState('total', value)
    }

    public setLoading(value: boolean): void {
        this.setState('loading', value)
    }

    @computed
    public get amount(): string | undefined {
        return this._state.amount
    }

    @computed
    public get leftToken(): string | undefined {
        return this._state.leftToken
    }

    @computed
    public get total(): string | undefined {
        return this._state.total
    }

    @computed
    public get loading(): boolean | undefined {
        return this._state.loading
    }
}