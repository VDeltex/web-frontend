import { Transaction, type Address } from 'everscale-inpage-provider'
import BigNumber from 'bignumber.js'
import { FEE, ROOT } from '@/config'
import { DexClusterContract, DexTokenContract, TokenWallet } from './contracts'
import { DexCalcExpectedSwap, DexCluster, DexNameToken, DexWallet } from '@/abi/types'
import { useRpcProvider } from '@broxus/js-core'


export abstract class DexUtils {

    // ClusterContract
    public static async _weightedPools(address = ROOT): Promise<DexCluster> {
        const provider = useRpcProvider("venom")
        const contract = DexClusterContract(address, provider)
        const { weightedPools } = await contract.methods.weightedPools().call()
        return weightedPools
    }

    public static async _calcExpectedSwap(poolId: string, inTokenId: string, outTokenId: string, amountIn: string, address = ROOT): Promise<DexCalcExpectedSwap> {
        const provider = useRpcProvider("venom")
        const contract = DexClusterContract(address, provider)
        const { value0 } = await contract.methods.calcExpectedSwap({
            poolId: poolId,
            inTokenId: inTokenId,
            outTokenId: outTokenId,
            amountIn: amountIn
        }).call()
        return value0
    }

    public static async _encodeSwapPayload(poolId: string, inTokenId: string, outTokenId: string, call_id: string, address = ROOT): Promise<DexCalcExpectedSwap> {
        const provider = useRpcProvider("venom")
        const contract = DexClusterContract(address, provider)
        const { value0 } = await contract.methods.encodeSwapPayload({
            poolId: poolId,
            inTokenId: inTokenId,
            outTokenId: outTokenId,
            call_id: call_id
        }).call()
        return value0
    }

    public static async _encodeJoinPayload(poolId: string, inTokenId: string, call_id: string, address = ROOT): Promise<DexCalcExpectedSwap> {
        const provider = useRpcProvider("venom")
        const contract = DexClusterContract(address, provider)
        const { value0 } = await contract.methods.encodeJoinPayload({
            poolId: poolId,
            inTokenId: inTokenId,
            call_id: call_id
        }).call()
        return value0
    }


    // TokenContract
    public static async _getName(address: Address): Promise<DexNameToken> {
        const provider = useRpcProvider("venom")
        const contract = DexTokenContract(address, provider)
        const { value0 } = await contract.methods.name({
            answerId: "0"
        }).call()
        return value0
    }

    public static async _getDecimals(address: Address): Promise<DexNameToken> {
        const provider = useRpcProvider("venom")
        const contract = DexTokenContract(address, provider)
        const { value0 } = await contract.methods.decimals({
            answerId: "0"
        }).call()
        return value0
    }

    public static async _getWallet(owner: Address, address: Address): Promise<DexWallet> {
        const provider = useRpcProvider("venom")
        const contract = DexTokenContract(address, provider)
        const { value0 } = await contract.methods.walletOf({
            answerId: "0",
            walletOwner: owner,
        }).call()
        return value0
    }

    // WalletContract
    public static async _transfer(address: Address, sender: Address, params: {
        amount: string | number;
        recipient: Address;
        deployWalletValue: string | number;
        remainingGasTo: Address;
        notify: boolean;
        payload: string;
    }): Promise<Transaction> {
        const provider = useRpcProvider("venom")
        const contract = TokenWallet(address, provider)
        const transaction = await contract.methods
            .transfer(params)
            .send({
                from: sender,
                amount: new BigNumber(FEE).toFixed(),
            })
        return transaction
    }
    
}

