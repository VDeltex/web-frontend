import * as React from 'react'
import { camelify, camelToSnake, formattedTokenAmount } from '@broxus/js-utils'
import { type DefaultLibraryType, ExplorerAccountLink, Icon, Skeleton, WalletAccount } from '@broxus/react-components'
import { Button, Dropdown, type DropRef, Flex, Grid, List } from '@broxus/react-uikit'
import classNames from 'classnames'
import { Observer, observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'


import { ConnectButton, useTvmWalletContext } from '@broxus/react-modules'
import defineMessages from './defineMessages'

export type TvmConnectorProps = {
    changeAccountButtonText?: React.ReactNode
    changeNetworkButtonText?: React.ReactNode
    changeWalletButtonText?: React.ReactNode
    connectButtonText?: React.ReactNode
    disconnectButtonText?: React.ReactNode
    popupType?: 'drawer' | 'modal'
    suffix?: React.ReactNode
    showDropMenu?: boolean
    showSubIcon?: boolean
    standalone?: boolean
}

export const TvmConnector = observer((props: TvmConnectorProps) => {
    const intl = useIntl()
    const wallet = useTvmWalletContext()

    const drop = React.useRef<DropRef>(null)

    const {
        changeAccountButtonText = intl.formatMessage(defineMessages.WALLET_CHANGE_ACCOUNT_BTN_TEXT),
        changeNetworkButtonText = intl.formatMessage(defineMessages.WALLET_CHANGE_NETWORK_BTN_TEXT),
        changeWalletButtonText = intl.formatMessage(defineMessages.WALLET_CHANGE_WALLET_BTN_TEXT),
        connectButtonText = intl.formatMessage(defineMessages.WALLET_CONNECT_BTN_TEXT),
        disconnectButtonText = intl.formatMessage(defineMessages.WALLET_DISCONNECT_BTN_TEXT),
        popupType,
        suffix,
        showDropMenu = true,
        showSubIcon = true,
        standalone = true,
    } = props

    const changeAccount = async (): Promise<void> => {
        if (wallet.hasProvider) {
            drop.current?.close()
            await wallet.provider.changeAccount()
        }
    }

    const changeNetwork = async (): Promise<void> => {
        if (wallet.hasProvider) {
            drop.current?.close()
            // await wallet.provider.changeNetwork?.()
        }
    }

    const changeWallet: VoidFunction = () => {
        drop.current?.close()
    }

    const disconnect = async (): Promise<void> => {
        if (wallet.hasProvider) {
            drop.current?.close()
            await wallet.disconnect()
        }
    }

    return (
        <Flex
            alignItems="stretch"
            className={classNames('uk-wallet-connector', wallet.providerId)}
            component={Grid}
            gap="small"
            justifyContent="between"
        >
            <Observer>
                {() => {
                    const isDisconnected = !wallet.isConnected || wallet.address === undefined
                    const icon = `tvm${wallet.networkId}BlockchainIcon` as keyof DefaultLibraryType
                    const service = wallet.providerId === 'ever' ? 'everWallet' : `${wallet.providerId.toLowerCase()}Wallet`
                    const walletIcon = `${camelify(camelToSnake(service))}Icon` as keyof DefaultLibraryType
                    let subTitle: React.ReactNode = intl.formatMessage(defineMessages.WALLET_NOT_CONNECTED_HINT)
                    if (wallet.isSyncing) {
                        subTitle = <Skeleton width={80} />
                    }
                    else if (wallet.isReady) {
                        subTitle = `${formattedTokenAmount(wallet.balance, wallet.currency.decimals)} ${
                            wallet.currency.symbol
                        }`
                    }

                    return (
                        <>
                            <div>
                                <WalletAccount
                                    address={wallet.address?.toString()}
                                    icon={<Icon icon={icon} ratio={1.6} />}
                                    subIcon={
                                        !isDisconnected && showSubIcon ? (
                                            <Icon icon={walletIcon} ratio={0.8} />
                                        ) : undefined
                                    }
                                    subTitle={subTitle}
                                    title={
                                        isDisconnected ? (
                                            intl.formatMessage(defineMessages.TVM_WALLET_CONNECTOR_BLOCKCHAIN_NAME)
                                        ) : (
                                            <ExplorerAccountLink
                                                address={wallet.address?.toString()}
                                                baseUrl={wallet.network?.explorer.baseUrl}
                                                copyable
                                                subPath={wallet.network?.explorer.accountsSubPath}
                                                tooltip={intl.formatMessage(
                                                    defineMessages.TVM_WALLET_CONNECTOR_EXPLORER_HINT,
                                                    {
                                                        explorerTitle: wallet.network?.explorer.title ?? '',
                                                    },
                                                )}
                                            />
                                        )
                                    }
                                />
                            </div>
                            <Flex alignItems="middle" className="uk-wallet-connector-suffix uk-position-relative">
                                {suffix}
                                {!isDisconnected && showDropMenu && (
                                    <Dropdown
                                        ref={drop}
                                        action="click"
                                        overlayClassName="uk-wallet-connector-dropdown"
                                        overlay={(
                                            <List className="uk-margin-remove" size="large">
                                                <List.Item>
                                                    <Button
                                                        className="uk-button-change-account"
                                                        type="link"
                                                        onClick={changeAccount}
                                                    >
                                                        {changeAccountButtonText}
                                                    </Button>
                                                </List.Item>
                                                <List.Item>
                                                    <Button
                                                        className="uk-button-change-network"
                                                        disabled
                                                        type="link"
                                                        onClick={changeNetwork}
                                                    >
                                                        {changeNetworkButtonText}
                                                    </Button>
                                                </List.Item>
                                                {!standalone && (
                                                    <List.Item key="connect-wallet">
                                                        <ConnectButton
                                                            className="uk-button-change-wallet"
                                                            popupType={popupType}
                                                            type="link"
                                                            onOpen={changeWallet}
                                                        >
                                                            {changeWalletButtonText}
                                                        </ConnectButton>
                                                    </List.Item>
                                                )}
                                                <List.Item>
                                                    <Button
                                                        aria-disabled={wallet.isDisconnecting}
                                                        className="uk-button-logout"
                                                        disabled={wallet.isDisconnecting}
                                                        type="link"
                                                        onClick={disconnect}
                                                    >
                                                        {disconnectButtonText}
                                                    </Button>
                                                </List.Item>
                                            </List>
                                        )}
                                        placement="bottom-right"
                                    >
                                        <Icon
                                            className="uk-wallet-connector-dropdown-trigger"
                                            icon="ellipsisVertical"
                                            ratio={0.8}
                                        />
                                    </Dropdown>
                                )}
                                {isDisconnected && (
                                    <ConnectButton key="connect" popupType={popupType} standalone={standalone}>
                                        {connectButtonText}
                                    </ConnectButton>
                                )}
                            </Flex>
                        </>
                    )
                }}
            </Observer>
        </Flex>
    )
})
