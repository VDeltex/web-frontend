import { DeltexCluster } from '@/abi/DeltexCluster.abi'
import { TokenRoot } from '@/abi/TokenRoot.abi'
import { TokenWalletUpgradeableAbi } from '@/abi/TokenWalletUpgradeable.abi'

import { resolveTvmAddress, useRpcClient, useRpcProvider } from '@broxus/js-core'
import { type Address, type Contract } from 'everscale-inpage-provider'


type DexClusterAbi = typeof DeltexCluster
type DexTokenAbi = typeof TokenRoot
type WalletUpgradeableAbi = typeof TokenWalletUpgradeableAbi

export function DexClusterContract(
    address: Address,
    provider = useRpcClient('venom'),
): Contract<DexClusterAbi> {
    return new provider.Contract(DeltexCluster, resolveTvmAddress(address))
}

export function DexTokenContract(
    address: Address,
    provider = useRpcClient('venom'),
): Contract<DexTokenAbi> {
    return new provider.Contract(TokenRoot, resolveTvmAddress(address))
}


export function TokenWallet(
    address: Address,
    provider = useRpcClient('venom'),
): Contract<WalletUpgradeableAbi> {
    return new provider.Contract(TokenWalletUpgradeableAbi, resolveTvmAddress(address))
}

