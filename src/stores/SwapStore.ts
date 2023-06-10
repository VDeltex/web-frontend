import { AbstractStore, TokensListService, TvmWalletService, useRpcProvider } from "@broxus/js-core";
import { useWalletsCache } from "@broxus/react-modules";
import { computed, makeObservable } from "mobx";
import { DexUtils } from "./utils";

type SwapStoreState = {
    amount?: string;
    total?: string
    rightToken?: string
    leftToken?: string
}

type SwapStoreData = {
    tokens: any[]
}


export class SwapStore extends AbstractStore<
    SwapStoreData,
    SwapStoreState
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
    }

    public get tokens() {
        return this._data.tokens
    }

    public setAmount(value: string): void {
        this.setState('amount', value)
    }

    public setRightToken(value: string): void {
        this.setState('rightToken', value)
    }

    public setLeftToken(value: string): void {
        this.setState('leftToken', value)
    }

    public setTotal(value: string): void {
        this.setState('total', value)
    }


    @computed
    public get amount(): string | undefined {
        return this._state.amount
    }

    @computed
    public get rightToken(): string | undefined {
        return this._state.rightToken
    }

    @computed
    public get leftToken(): string | undefined {
        return this._state.leftToken
    }

    @computed
    public get total(): string | undefined {
        return this._state.total
    }
}