export const DeltexCluster = {
    "ABI version": 2,
    version: "2.2",
    header: [
        "time"
    ],
    functions: [
        {
            name: "constructor",
            inputs: [
                {
                    name: "_owner",
                    type: "address"
                }
            ],
            outputs: []
        },
        {
            name: "upgrade",
            inputs: [
                {
                    name: "new_code",
                    type: "cell"
                }
            ],
            outputs: []
        },
        {
            name: "transferOwnership",
            inputs: [
                {
                    name: "new_owner",
                    type: "address"
                },
                {
                    components: [
                        {
                            name: "call_id",
                            type: "uint32"
                        },
                        {
                            name: "send_gas_to",
                            type: "address"
                        }
                    ],
                    name: "meta",
                    type: "tuple"
                }
            ],
            outputs: []
        },
        {
            name: "encodeSwapPayload",
            inputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "inTokenId",
                    type: "uint8"
                },
                {
                    name: "outTokenId",
                    type: "uint8"
                },
                {
                    name: "call_id",
                    type: "uint32"
                }
            ],
            outputs: [
                {
                    name: "value0",
                    type: "cell"
                }
            ]
        },
        {
            name: "encodeJoinPayload",
            inputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "inTokenId",
                    type: "uint8"
                },
                {
                    name: "call_id",
                    type: "uint32"
                }
            ],
            outputs: [
                {
                    name: "value0",
                    type: "cell"
                }
            ]
        },
        {
            name: "decodeTokenTransfer",
            inputs: [
                {
                    name: "payload",
                    type: "cell"
                }
            ],
            outputs: [
                {
                    name: "_type",
                    type: "uint8"
                },
                {
                    name: "call_id",
                    type: "uint32"
                },
                {
                    name: "action_payload",
                    type: "cell"
                }
            ]
        },
        {
            name: "decodeSwapPayload",
            inputs: [
                {
                    name: "payload",
                    type: "cell"
                }
            ],
            outputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "inTokenId",
                    type: "uint8"
                },
                {
                    name: "outTokenId",
                    type: "uint8"
                }
            ]
        },
        {
            name: "decodeJoinPayload",
            inputs: [
                {
                    name: "payload",
                    type: "cell"
                }
            ],
            outputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "inTokenId",
                    type: "uint8"
                }
            ]
        },
        {
            name: "onAcceptTokensTransfer",
            inputs: [
                {
                    name: "tokenRoot",
                    type: "address"
                },
                {
                    name: "amount",
                    type: "uint128"
                },
                {
                    name: "sender",
                    type: "address"
                },
                {
                    name: "value3",
                    type: "address"
                },
                {
                    name: "remainingGasTo",
                    type: "address"
                },
                {
                    name: "payload",
                    type: "cell"
                }
            ],
            outputs: []
        },
        {
            name: "calcExpectedSwap",
            inputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "inTokenId",
                    type: "uint8"
                },
                {
                    name: "outTokenId",
                    type: "uint8"
                },
                {
                    name: "amountIn",
                    type: "uint256"
                }
            ],
            outputs: [
                {
                    name: "value0",
                    type: "uint256"
                }
            ]
        },
        {
            name: "receiveTokenWalletAddress",
            inputs: [
                {
                    name: "wallet",
                    type: "address"
                }
            ],
            outputs: []
        },
        {
            name: "initializePool",
            inputs: [
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "amountsIn",
                    type: "uint256[]"
                }
            ],
            outputs: []
        },
        {
            name: "createPool",
            inputs: [
                {
                    name: "tokens",
                    type: "address[]"
                },
                {
                    name: "normalizedWeights",
                    type: "uint64[]"
                },
                {
                    name: "scalingFactors",
                    type: "uint8[]"
                },
                {
                    components: [
                        {
                            name: "call_id",
                            type: "uint32"
                        },
                        {
                            name: "send_gas_to",
                            type: "address"
                        }
                    ],
                    name: "meta",
                    type: "tuple"
                }
            ],
            outputs: []
        },
        {
            name: "getSwapFeePercentage",
            inputs: [],
            outputs: [
                {
                    name: "value0",
                    type: "uint256"
                }
            ]
        },
        {
            name: "weightedPools",
            inputs: [],
            outputs: [
                {
                    components: [
                        {
                            components: [
                                {
                                    name: "token",
                                    type: "address"
                                },
                                {
                                    name: "scalingFactor",
                                    type: "uint8"
                                },
                                {
                                    name: "normalizedWeight",
                                    type: "uint64"
                                },
                                {
                                    name: "balance",
                                    type: "uint128"
                                }
                            ],
                            name: "tokens",
                            type: "tuple[]"
                        },
                        {
                            name: "dpt",
                            type: "address"
                        },
                        {
                            name: "dptTotalSupply",
                            type: "uint256"
                        }
                    ],
                    name: "weightedPools",
                    type: "map(uint16,tuple)"
                }
            ]
        },
        {
            name: "rootToWallet",
            inputs: [],
            outputs: [
                {
                    name: "rootToWallet",
                    type: "map(address,address)"
                }
            ]
        }
    ],
    data: [
        {
            key: 1,
            name: "deploy_nonce",
            type: "uint32"
        },
        {
            key: 2,
            name: "tokenRootCode",
            type: "cell"
        },
        {
            key: 3,
            name: "tokenWalletCode",
            type: "cell"
        }
    ],
    events: [
        {
            name: "Swap",
            inputs: [
                {
                    name: "call_id",
                    type: "uint32"
                },
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "amount",
                    type: "uint256"
                },
                {
                    name: "tokenRoot",
                    type: "address"
                },
                {
                    name: "amountOut",
                    type: "uint256"
                },
                {
                    name: "tokenOut",
                    type: "address"
                }
            ],
            outputs: []
        },
        {
            name: "Join",
            inputs: [
                {
                    name: "call_id",
                    type: "uint32"
                },
                {
                    name: "poolId",
                    type: "uint16"
                },
                {
                    name: "amount",
                    type: "uint256"
                },
                {
                    name: "tokenRoot",
                    type: "address"
                },
                {
                    name: "dptMinted",
                    type: "uint256"
                }
            ],
            outputs: []
        },
        {
            name: "NewPool",
            inputs: [
                {
                    name: "call_id",
                    type: "uint32"
                },
                {
                    components: [
                        {
                            components: [
                                {
                                    name: "token",
                                    type: "address"
                                },
                                {
                                    name: "scalingFactor",
                                    type: "uint8"
                                },
                                {
                                    name: "normalizedWeight",
                                    type: "uint64"
                                },
                                {
                                    name: "balance",
                                    type: "uint128"
                                }
                            ],
                            name: "tokens",
                            type: "tuple[]"
                        },
                        {
                            name: "dpt",
                            type: "address"
                        },
                        {
                            name: "dptTotalSupply",
                            type: "uint256"
                        }
                    ],
                    name: "new_pool",
                    type: "tuple"
                }
            ],
            outputs: []
        },
        {
            name: "NewOwner",
            inputs: [
                {
                    name: "call_id",
                    type: "uint32"
                },
                {
                    name: "new_owner",
                    type: "address"
                }
            ],
            outputs: []
        }
    ],
    fields: [
        {
            name: "_pubkey",
            type: "uint256"
        },
        {
            name: "_timestamp",
            type: "uint64"
        },
        {
            name: "_constructorFlag",
            type: "bool"
        },
        {
            name: "deploy_nonce",
            type: "uint32"
        },
        {
            name: "tokenRootCode",
            type: "cell"
        },
        {
            name: "tokenWalletCode",
            type: "cell"
        },
        {
            name: "poolsCount",
            type: "uint16"
        },
        {
            name: "owner",
            type: "address"
        },
        {
            components: [
                {
                    components: [
                        {
                            name: "token",
                            type: "address"
                        },
                        {
                            name: "scalingFactor",
                            type: "uint8"
                        },
                        {
                            name: "normalizedWeight",
                            type: "uint64"
                        },
                        {
                            name: "balance",
                            type: "uint128"
                        }
                    ],
                    name: "tokens",
                    type: "tuple[]"
                },
                {
                    name: "dpt",
                    type: "address"
                },
                {
                    name: "dptTotalSupply",
                    type: "uint256"
                }
            ],
            name: "weightedPools",
            type: "map(uint16,tuple)"
        },
        {
            name: "rootToWallet",
            type: "map(address,address)"
        }
    ]
} as const