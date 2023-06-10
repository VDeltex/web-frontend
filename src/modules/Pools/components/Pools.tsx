import * as React from 'react'
import { observer } from "mobx-react-lite"
import { useStore } from '@/hooks/useStore'
import { DexStore } from '@/stores/DexStore'
import { Button, Card, Flex, Text, Tile, Width } from '@broxus/react-uikit'
import { Pool } from './Pool'
import BigNumber from 'bignumber.js'
import { TextInput } from '@/components/TextInput'
import CoinEverLogo from '@/assets/icons/EVER.svg'
import { PoolSelect } from '@broxus/react-components'
import { useTokensListContext } from '@broxus/react-modules'
import { useTvmWallet } from '@/utils'
import { TokensListService } from '@broxus/js-core'
import { useHistory } from 'react-router-dom'
import { appRoutes } from '@/routes'

export default function PoolsInner(): JSX.Element {
    const Dex = useStore(DexStore)
    const wallet = useTvmWallet()
    const history = useHistory()

    React.useEffect(() => {
        Dex.weightedPools()
    }, [wallet.isConnected])
    
    const swap = (iPool: number) => {
        Dex.addSwap(iPool)
        history.push(appRoutes.swap.path)
    }

    const liquidity = (iPool: number) => {
        Dex.addLiquidity(iPool)
        history.push(appRoutes.liquidity.path)
    }

    return (
        <Flex>
            {Dex.pools ? Dex.pools.map((item, iPool) => (
                <Width size='1-3' style={{ cursor: 'pointer' }} className='uk-margin-medium-right uk-margin-medium-bottom'>
                    {/* <div>
                        {item[1].tokens.map((item, i) => (
                            <Text>
                                {//@ts-ignore 
                                    item.name}
                            </Text>
                        ))}
                    </div> */}
                    <Tile type='primary' className="uk-padding-small">
                        <table className="uk-table uk-table-divider uk-width-1-1 table uk-padding-remove uk-margin-small-bottom">
                            <thead className="uk-height-1-1">
                                <tr>
                                    <th className="uk-text-left uk-width-medium">Coin</th>
                                    <th className="uk-text-left uk-width-medium">Weight</th>
                                </tr>
                            </thead>
                            <tbody className="uk-height-small">
                                {item[1].tokens.map((item, iToken) => (
                                    <>
                                        <tr>
                                            <td className="uk-text-left uk-width-medium"><Pool tokenAddress={item.token} iPool={iPool} iToken={iToken} /></td>
                                            <td className="uk-text-left uk-width-medium">{(new BigNumber(item.normalizedWeight).div('1e18').times(100)).toString()}%</td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                        <Tile type='primary' className="uk-padding-small">
                            <Card>
                                <Text component='h5'>
                                    TVL : {" "}
                                    { //@ts-ignore 
                                        new BigNumber(item[1].tvl).toFixed(2)
                                    }$
                                </Text>
                            </Card>
                        </Tile>

                        {wallet.isConnected &&
                            <Flex className='uk-margin-small-top' justifyContent='around'>
                                <Button type='default' size='medium' onClick={() => swap(iPool)}>
                                    Make an swap
                                </Button>
                                <Button type='default' onClick={() => liquidity(iPool)}>
                                    Add liquidity
                                </Button>
                            </Flex>
                        }
                    </Tile>
                </Width>
            ))
                :
                <Text>
                    Loading...
                </Text>
            }
        </Flex>
    )
}

export const Pools = observer(PoolsInner)
