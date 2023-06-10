import * as React from 'react'
import { Observer, observer } from "mobx-react-lite"
import { useStore } from '@/hooks/useStore'
import { DexStore } from '@/stores/DexStore'
import { Button, Flex, Modal, Text, Tile } from '@broxus/react-uikit'
import { TextInput } from '@/components/TextInput'
import { ComposedTokenSelector, TokensList, useTokensListContext, useTokensWalletsContext, useTvmWalletContext } from '@broxus/react-modules'
import BigNumber from 'bignumber.js'

export default function SwapFormInner(): JSX.Element {

    const Dex = useStore(DexStore)
    const wallet = useTvmWalletContext()
    const tokensList = useTokensListContext()
    const tokensWallets = useTokensWalletsContext()

    const token = Dex.swap.leftToken && tokensList.get(Dex.swap.leftToken)
    const tokenWallet = Dex.swap.leftToken && tokensWallets.get(wallet.account?.address!, Dex.swap.leftToken!)

    function findIndexByParam(paramValue: string, arr = Dex.swap.tokens) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].token.toString() === paramValue) {
                return i;
            }
        }
        return -1;
    }

    React.useEffect(() => {
        if (Dex.swap.leftToken && Dex.swap.rightToken && Dex.swap.amount && token) {
            Dex.calcExpectedSwap(
                Dex.swap.poll[0],
                findIndexByParam(Dex.swap.leftToken).toString(),
                findIndexByParam(Dex.swap.rightToken).toString(),
                new BigNumber(Dex.swap.amount).shiftedBy(token.decimals).toFixed()
            )
        } else {
            Dex.swap.setState('total', '0')
        }
    }, [Dex.swap.rightToken, Dex.swap.leftToken, Dex.swap.amount, token])

    const onSwap = () => {
        if (token && tokenWallet)
            Dex.sendSwap(
                Dex.swap.poll[0],
                findIndexByParam(Dex.swap.leftToken!).toString(),
                findIndexByParam(Dex.swap.rightToken!).toString(),
                Math.floor(Math.random() * Math.pow(2, 32)).toString(),
                token.decimals,
                tokenWallet?.address
            )
    }

    return (
        <div>
            <Observer>
                {() => (
                    <Tile type='primary' className="uk-padding-small form">
                        <InputToken readOnly={false} />
                        <InputToken readOnly={true} />
                        {Dex.swap.leftToken && Dex.swap.rightToken ?
                            token && (new BigNumber(tokensWallets.get(wallet.account?.address!, token?.address.toString()!)?.balance! ?? 0).shiftedBy(-token?.decimals!).toFixed()) < (Dex.swap.amount ?? 0) ?
                                <Button type='primary' disabled>
                                    Not enough money
                                </Button>
                                :
                                (!Dex.swap.loading ?
                                    <Button type='primary'
                                        onClick={onSwap}>
                                        Swap
                                    </Button>
                                    :
                                    <Button disabled type='primary'>
                                        Swaping...
                                    </Button>)
                            :
                            <Button disabled type='primary'>
                                First you need select tokens...
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
        .filter(item => Dex.swap.tokens.some(obj => obj.token.toString() === item.root && (item.root !== (readOnly ? Dex.swap.leftToken : Dex.swap.rightToken))))

    const openListDialog = (): void => {
        setListVisibility(true)
    }

    const closeListDialog = (): void => {
        setListVisibility(false)
    }


    const onSelectToken = (root?: string): void => {
        setSelectedCombo(false)
        setSelectedCurrency(false)
        setSelectToken(root)
        if (root)
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
                        disabled={Dex.swap.leftToken && Dex.swap.rightToken && !Dex.swap.loading ? false : true}
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
                            //@ts-ignore
                            className="list"
                        />
                    </Modal>
                </div>
            )}
        </Observer>
    )
}

export const SwapForm = observer(SwapFormInner)

