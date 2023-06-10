import * as React from 'react'
import { Observer, observer } from "mobx-react-lite"
import { useStore } from '@/hooks/useStore'
import { DexStore } from '@/stores/DexStore'
import { Button, Card, Flex, Modal, Text, Tile } from '@broxus/react-uikit'
import { Address } from 'everscale-inpage-provider'
import { TextInput } from '@/components/TextInput'
import CoinEverLogo from '@/assets/icons/EVER.svg'
import { ComposedTokenSelector, ComposedTokensListDialog, TokensList, TokensListProvider, useTokensListContext, useTokensWalletsContext, useTvmWalletContext } from '@broxus/react-modules'
import { resolveTvmAddress } from '@broxus/js-core'
import { useTvmWallet } from '@/utils'
import { reaction } from 'mobx'
import classNames from 'classnames'
import BigNumber from 'bignumber.js'
import { TokenBadge } from '@broxus/react-components'
/* eslint-disable */

export default function SwapFormInner(): JSX.Element {

    const Dex = useStore(DexStore)
    const wallet = useTvmWalletContext()
    const tokensList = useTokensListContext()
    const tokensWallets = useTokensWalletsContext()

    function findIndexByParam(paramValue: string, arr = Dex.swap.tokens) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].token.toString() === paramValue) {
                return i;
            }
        }
        return -1; // Если объект не найден
    }

    const token = tokensList.get(Dex.swap.leftToken)
    const tokenWallet = tokensWallets.get(wallet.account?.address!, Dex.swap.leftToken!)
    React.useEffect(() => {
        if (Dex.swap.leftToken && Dex.swap.rightToken && Dex.swap.amount) {
            console.log(Dex.swap.poll[0])
            console.log(findIndexByParam(Dex.swap.leftToken).toString())
            console.log(findIndexByParam(Dex.swap.rightToken).toString())
            console.log(new BigNumber(Dex.swap.amount!).shiftedBy(token?.decimals!).toFixed())
            Dex.calcExpectedSwap(
                Dex.swap.poll[0],
                findIndexByParam(Dex.swap.leftToken).toString(),
                findIndexByParam(Dex.swap.rightToken).toString(),
                new BigNumber(Dex.swap.amount!).shiftedBy(token?.decimals!).toFixed()
            )
        }
    }, [Dex.swap.rightToken, Dex.swap.leftToken, Dex.swap.amount])

    function generateRandomUint32() {
        return Math.floor(Math.random() * Math.pow(2, 32)).toString();
    }

    return (
        <div>
            <Observer>
                {() => (
                    <Tile type='primary' className="uk-padding-small form">
                        {/* <p onClick={() => }>test</p> */}
                        <InputToken readOnly={false} />
                        <InputToken readOnly={true} />

                        {Dex.swap.leftToken && Dex.swap.rightToken ?
                            <Button type='primary' onClick={() => Dex.sendSwap(
                                Dex.swap.poll[0],
                                findIndexByParam(Dex.swap.leftToken!).toString(),
                                findIndexByParam(Dex.swap.rightToken!).toString(),
                                generateRandomUint32(),
                                token?.decimals!,
                                tokenWallet?.address!
                            )}>
                                Swap
                            </Button>
                            :
                            <Button disabled type='primary'>
                                First you need select tokens
                            </Button>
                        }

                    </Tile>
                )}
            </Observer>
        </div>
    )
}


function InputToken({ readOnly }: { readOnly: boolean }): JSX.Element {
    const Dex = useStore(DexStore)
    const wallet = useTvmWalletContext()
    const tokensList = useTokensListContext()
    const tokensWallets = useTokensWalletsContext()

    const [selectedToken, setSelectToken] = React.useState<string | undefined>(Dex.swap.tokens[1].root)
    const [comboSelected, setSelectedCombo] = React.useState(true)
    const [currencySelected, setSelectedCurrency] = React.useState(false)
    const [isListShown, setListVisibility] = React.useState(false)

    const token = tokensList.get(selectedToken)

    const pollTokens = tokensList.tokens
        .filter(item => Dex.swap.tokens.some(obj => obj.token.toString() === item.root))

    const openListDialog = (): void => {
        setListVisibility(true)
    }

    const closeListDialog = (): void => {
        setListVisibility(false)
    }


    const onSelectToken = (root: string): void => {
        setSelectedCombo(false)
        setSelectedCurrency(false)
        setSelectToken(root)
        if (readOnly) {
            Dex.swap.setRightToken(root)
        } else {
            Dex.swap.setLeftToken(root)
        }
        closeListDialog()
    }

    return (
        <Observer>
            {() => (
                <div className='swap-input uk-margin-small-bottom'>
                    <Flex>
                        <ComposedTokenSelector
                            token={token}
                            type="default"
                            onClick={openListDialog}
                        />
                        {token &&
                            <Text style={{
                                margin: "auto 0",
                                marginLeft: "18px"
                            }}>
                                Balance: {token && (new BigNumber(tokensWallets.get(wallet.account?.address!, token?.address.toString()!)?.balance! ?? 0).shiftedBy(-token?.decimals!).toFixed())}
                            </Text>
                        }

                    </Flex>
                    <TextInput
                        placeholder="Enter amount token"
                        value={readOnly ?
                            new BigNumber(Dex.swap.total ?? 0).shiftedBy(token ? -token?.decimals : 0).toFixed()
                            : Dex.swap.amount}
                        onChange={e => Dex.swap.setAmount(e)}
                        maxValue={token && new BigNumber(tokensWallets.get(wallet.account?.address!, token?.address.toString()!)?.balance!).shiftedBy(-token?.decimals!).toFixed()}
                        disabled={Dex.swap.leftToken && Dex.swap.rightToken ? false : true}
                        inputMode="numeric"
                        showMaxButton={readOnly ? false : true}
                        readOnly={readOnly}
                    />

                    <Modal
                        visible={isListShown}
                        onClose={closeListDialog}
                        onClosed={closeListDialog}
                        width='100%'
                    >
                        <TokensList
                            comboSelected={comboSelected}
                            currencySelected={currencySelected}
                            currentToken={comboSelected ? undefined : selectedToken}
                            isCurrencySyncing={wallet.isSyncing}
                            owner={wallet.account?.address.toString()}
                            onSelectToken={onSelectToken}
                            tokens={pollTokens}
                            className="list"
                        />
                    </Modal>
                </div>
            )}
        </Observer>
    )
}

export const SwapForm = observer(SwapFormInner)

