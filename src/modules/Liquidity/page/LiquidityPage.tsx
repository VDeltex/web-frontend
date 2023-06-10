import * as React from 'react'
import './LiquidityPage.scss'
import { useTvmWallet } from '@/utils'
import { useIntl } from 'react-intl'
import { DexStore } from '@/stores/DexStore'
import { useStore } from '@/hooks/useStore'
import { LiquidityForm } from '../components/LiquidityForm'
import { TokensListProvider, TokensWalletsProvider } from '@broxus/react-modules'
import { Observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { appRoutes } from '@/routes'


export default function LiquidityPage(): JSX.Element {
    const intl = useIntl()
    const wallet = useTvmWallet()
    const Dex = useStore(DexStore)
    const history = useHistory()

    React.useEffect(() => {
        Dex.weightedPools()
    }, [])

    React.useEffect(() => {
        if (!Dex.liquidity) {
            history.push(appRoutes.pools.path)
        }
    }, [Dex.liquidity])

    return (
        <div className="Liquidity">
            {Dex.liquidity &&
                <Observer>
                    {() => (
                        <LiquidityForm />
                    )}
                </Observer>
            }
        </div>
    )
}
