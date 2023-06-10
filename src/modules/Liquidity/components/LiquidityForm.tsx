import * as React from 'react'
import { Observer, observer } from "mobx-react-lite"
import { useStore } from '@/hooks/useStore'
import { DexStore } from '@/stores/DexStore'
import { Button, Flex, Modal, Text, Tile } from '@broxus/react-uikit'
import { TextInput } from '@/components/TextInput'
import { ComposedTokenSelector, TokensList, useTokensListContext, useTokensWalletsContext, useTvmWalletContext } from '@broxus/react-modules'
import BigNumber from 'bignumber.js'
import { Pool } from '@/modules/Pools/components/Pool'

export default function LiquidityFormInner(): JSX.Element {

    const Dex = useStore(DexStore)
    const wallet = useTvmWalletContext()
    const tokensList = useTokensListContext()
    const tokensWallets = useTokensWalletsContext()

    const token = Dex.liquidity.leftToken && tokensList.get(Dex.liquidity.leftToken)
    const tokenWallet = Dex.liquidity.leftToken && tokensWallets.get(wallet.account?.address!, Dex.liquidity.leftToken!)

    function findIndexByParam(paramValue: string, arr = Dex.liquidity.tokens) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].token.toString() === paramValue) {
                return i;
            }
        }
        return -1;
    }

    const onLiquidity = () => {
        if (token && tokenWallet)
            Dex.sendLiquidity(
                Dex.liquidity.poll[0],
                findIndexByParam(Dex.liquidity.leftToken!).toString(),
                Math.floor(Math.random() * Math.pow(2, 32)).toString(),
                token.decimals,
                tokenWallet?.address
            )
    }

    console.log(Dex.liquidity.tokens)

    return (
        <div>
            <Observer>
                {() => (
                    <Tile type='primary' className="uk-padding-small form">
                        <InputToken />
                        {Dex.liquidity.leftToken ?
                            !Dex.liquidity.loading ?
                                <Button type='primary' onClick={onLiquidity}>
                                    Liquidity
                                </Button>
                                :
                                <Button disabled type='primary'>
                                    Adding liquidity...
                                </Button>
                            :
                            <Button disabled type='primary'>
                                First you need select tokens...
                            </Button>
                        }
                        <table className="uk-table uk-table-divider uk-width-1-1 table uk-padding-remove uk-margin-small-bottom">
                            <thead className="uk-height-1-1">
                                <tr>
                                    <th className="uk-text-left uk-width-medium">Current liquidity:</th>
                                    <th className="uk-text-left uk-width-medium">Balance liquidity:</th>
                                </tr>
                            </thead>
                            <tbody className="uk-height-small">
                                {Dex.liquidity ? Dex.liquidity.tokens.map((item, iToken) => (
                                    <>
                                        <tr>
                                            <td className="uk-text-left uk-width-medium">
                                                {item.name}
                                            </td>
                                            <td className="uk-text-left uk-width-medium">
                                                {new BigNumber(item.balance).shiftedBy(-item?.decimals!).toFixed(4)}
                                            </td>
                                        </tr>
                                    </>
                                ))
                                    :
                                    <>

                                    </>
                                }
                            </tbody>
                        </table>
                    </Tile>
                )}
            </Observer>
        </div>
    )
}


function InputToken(): JSX.Element {
    const Dex = useStore(DexStore)
    const wallet = useTvmWalletContext()
    const tokensList = useTokensListContext()
    const tokensWallets = useTokensWalletsContext()

    const [selectedToken, setSelectToken] = React.useState<string | undefined>(Dex.liquidity.tokens[1].root)
    const [comboSelected, setSelectedCombo] = React.useState(true)
    const [currencySelected, setSelectedCurrency] = React.useState(false)
    const [isListShown, setListVisibility] = React.useState(false)

    const token = tokensList.get(selectedToken)

    const pollTokens = tokensList.tokens
        .filter(item => Dex.liquidity.tokens.some(obj => obj.token.toString() === item.root))

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
            Dex.liquidity.setLeftToken(root)
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
                        value={Dex.liquidity.amount}
                        onChange={e => Dex.liquidity.setAmount(e)}
                        maxValue={token && new BigNumber(tokensWallets.get(wallet.account?.address!, token?.address.toString()!)?.balance!).shiftedBy(-token?.decimals!).toFixed()}
                        disabled={Dex.liquidity.leftToken && !Dex.liquidity.loading ? false : true}
                        inputMode="numeric"
                        showMaxButton={true}
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

export const LiquidityForm = observer(LiquidityFormInner)

