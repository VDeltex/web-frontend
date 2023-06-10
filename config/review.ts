import { Address } from "everscale-inpage-provider"

export type NetworkGroup = 'mainnet' | 'testnet' | 'fld' | 'rfld' | 'localnet' | string

export const USDT_DECIMALS = 6
export const PRICE__DECIMALS = 8
export const MULTIPLICATOR__DECIMALS = 3
export const FEE = 2500000000 

export const ROOT = new Address("0:e08f12a81f1783f5afef061ac1b31d783514320703ca86f75738ff6e09ca90dc")
