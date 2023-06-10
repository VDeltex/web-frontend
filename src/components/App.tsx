import React from 'react'
import {
    BrowserRouter as Router, Redirect, Route, Switch, useHistory,
} from 'react-router-dom'
import { TokensListProvider, TokensWalletsProvider, TvmWalletProvider, TvmWalletProvidersProvider } from '@broxus/react-modules'
import { IntlProvider } from 'react-intl'

import { LocalizationContext } from '@/context/Localization'
import { useTvmWallet, noop } from '@/utils'
import { appRoutes } from '@/routes'

import './App.scss'

import PoolsPage from '@/modules/Pools'
import { useProvider } from '@/hooks/useStore'
import { ScrollManager } from './layout/ScrollManager'
import { Header } from './layout/Header'
import { DexStore } from '@/stores/DexStore'
import SwapPage from '@/modules/Swap/page/SwapPage'
import { PROVIDERS_CONFIG } from '@/providers-config'
import LiquidityPage from '@/modules/Liquidity/page/LiquidityPage'
import { Toaster } from 'react-hot-toast'

export function App(): JSX.Element {
    const localization = React.useContext(LocalizationContext)
    const wallet = useTvmWallet()
    const history = useHistory()
    const DexStoreProvider = useProvider(DexStore, wallet, history)
    const listUri = './manifest.json'

    return (
        <IntlProvider
            key="intl"
            locale={localization.locale}
            defaultLocale="en"
            messages={localization.messages}
            onError={noop}
        >
            <TvmWalletProvider wallet={wallet}>
                <TvmWalletProvidersProvider providers={PROVIDERS_CONFIG}>
                    <TokensListProvider
                        key={listUri}
                        connection={wallet.connection}
                        listUri={listUri}
                    >
                        <TokensWalletsProvider address={wallet.address} connection={wallet.connection}>
                            <Router>
                                <ScrollManager>
                                    <div className="wrapper uk-light" >
                                        <Header key="header" />
                                        <main className="main">
                                            <DexStoreProvider>
                                                <Switch>
                                                    <Route exact path="/">
                                                        <Redirect exact to={appRoutes.pools.makeUrl()} />
                                                    </Route>
                                                    <Route path={appRoutes.pools.path}>
                                                        <PoolsPage />
                                                    </Route>
                                                    <Route path={appRoutes.swap.path}>
                                                        <SwapPage />
                                                    </Route>
                                                    <Route path={appRoutes.liquidity.path}>
                                                        <LiquidityPage />
                                                    </Route>
                                                </Switch>
                                            </DexStoreProvider>
                                            <Toaster />
                                        </main>
                                    </div>
                                </ScrollManager>
                            </Router>
                        </TokensWalletsProvider>
                    </TokensListProvider>
                </TvmWalletProvidersProvider>
            </TvmWalletProvider>
        </IntlProvider>
    )
}
