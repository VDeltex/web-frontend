import { TokenRoot } from './TokenRoot.abi'
import { DeltexCluster } from './DeltexCluster.abi'
import { DecodedAbiFunctionOutputs } from 'everscale-inpage-provider'

export type DexCluster = DecodedAbiFunctionOutputs<typeof DeltexCluster, 'weightedPools'>['weightedPools']
export type DexCalcExpectedSwap = DecodedAbiFunctionOutputs<typeof DeltexCluster, 'calcExpectedSwap'>['value0']

export type DexNameToken = DecodedAbiFunctionOutputs<typeof TokenRoot, 'name'>['value0']
export type DexWallet = DecodedAbiFunctionOutputs<typeof TokenRoot, 'walletOf'>['value0']
