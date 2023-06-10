import * as React from 'react'
import { Observer, observer } from 'mobx-react-lite'
import Media from 'react-media'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import {
    Button, Flex, Navbar, Text,
} from '@broxus/react-uikit'
import { ConnectButton, TvmConnector, useTvmWalletContext } from '@broxus/react-modules'
import { Icon } from '@broxus/react-components'


import { appRoutes } from '@/routes'

import './Header.scss'
import { useStore } from '@/hooks/useStore'

export function HeaderInner(): JSX.Element {
    const wallet = useTvmWalletContext()
    const intl = useIntl()

    return (
        <header className="header">
            <Navbar className="uk-width-expand">
                <Media query={{ minWidth: 768 }}>
                    {match => (match
                        ? (
                            <>
                                <Navbar.Left className="uk-width-expand">
                                    <Link to={appRoutes.home.makeUrl()} className="logo">
                                        <img width={120} src='https://thumb.tildacdn.com/tild3930-3637-4438-b830-306239306234/-/cover/400x88/center/center/-/format/webp/Logo_deltex_invert_1.png' />
                                    </Link>
                                </Navbar.Left>

                                <Observer>
                                    {() => (
                                        <Navbar.Right className="header-switchers" component={Navbar.Item}>
                                            <TvmConnector
                                                standalone
                                                showDropMenu={false}

                                            />
                                            {wallet.isConnected
                                                && (
                                                    <Button
                                                        type="default"
                                                        style={{ padding: '0px 5px' }}
                                                        onClick={() => wallet.disconnect()}
                                                    >
                                                        <Icon className="iconLogout" icon="logout" />
                                                    </Button>
                                                )}
                                        </Navbar.Right>
                                    )}
                                </Observer>
                            </>
                        )
                        : (
                            <Observer>
                                {() => (
                                    <>
                                        <Navbar.Left>
                                            <Navbar.Item>
                                                <Link to={appRoutes.home.makeUrl()} className="logo">
                                                    LOGO
                                                </Link>
                                            </Navbar.Item>
                                        </Navbar.Left>
                                        <Navbar.Right>
                                            <Navbar.Item>
                                                {wallet.isConnected
                                                    ? (
                                                        <TvmConnector
                                                            standalone
                                                            showDropMenu={false}
                                                        />
                                                    )
                                                    : (
                                                        <ConnectButton
                                                            key="connect"
                                                            popupType="modal"
                                                            type="default"
                                                            className="button-connect"
                                                            standalone
                                                        >
                                                            {intl.formatMessage({
                                                                id: 'CONNECT_WALLET',
                                                            })}
                                                        </ConnectButton>
                                                    )}

                                            </Navbar.Item>
                                        </Navbar.Right>
                                    </>
                                )}
                            </Observer>
                        ))}
                </Media>
            </Navbar>
        </header>
    )
}

export const Header = observer(HeaderInner)
