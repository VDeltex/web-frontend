import * as React from 'react'
import './SwapPage.scss'
import { useTvmWallet } from '@/utils'
import { useIntl } from 'react-intl'
import { DexStore } from '@/stores/DexStore'
import { useStore } from '@/hooks/useStore'
import { SwapForm } from '../components/SwapForm'
import { TokensListProvider, TokensWalletsProvider } from '@broxus/react-modules'
import { Observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { appRoutes } from '@/routes'


export default function SwapPage(): JSX.Element {
    const intl = useIntl()
    const wallet = useTvmWallet()
    const Dex = useStore(DexStore)
    const history = useHistory()

    React.useEffect(() => {
        Dex.weightedPools()
    }, [])

    React.useEffect(() => {
        console.log(Dex.swap)
        if (!Dex.swap) {
            history.push(appRoutes.pools.path)
        }
    }, [Dex.swap])

    return (
        <div className="swap">
            {Dex.swap &&
                <Observer>
                    {() => (
                        <SwapForm />
                    )}
                </Observer>
            }
        </div>
    )
}
