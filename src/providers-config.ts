import { useRpcClient, useRpcProvider } from '@broxus/js-core'
import { isBrowser } from '@broxus/js-utils'
import { type TvmWalletProviderConfig } from '@broxus/react-modules'

let ensurePageLoaded: Promise<any>
if (!isBrowser() || document.readyState === 'complete') {
    ensurePageLoaded = Promise.resolve()
}
else {
    ensurePageLoaded = new Promise(resolve => {
        window.addEventListener('load', () => {
            resolve(true)
        })
    })
}

async function hasVenomProvider(): Promise<boolean> {
    if (!isBrowser()) {
        return false
    }
    await ensurePageLoaded
    return window.__hasVenomProvider === true || window.hasTonProvider === true
}

export const PROVIDERS_CONFIG: TvmWalletProviderConfig[] = [
    {
        baseNetwork: 1000,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        connection: useRpcClient('venom'),
        display: {
            icon: '/assets/icons/VENOM.svg',
            links: {
                android: 'https://play.google.com/store/apps/details?id=com.venom.wallet',
                chromeExtension: 'https://chrome.google.com/webstore/detail/venom-wallet/ojggmchlghnjlapmfbnjholfjkiidbch',
                ios: 'https://apps.apple.com/app/venom-blockchain-wallet/id1622970889',
            },
            title: 'Venom Wallet',
        },
        hasProvider: hasVenomProvider,
        id: 'venom',
        // eslint-disable-next-line react-hooks/rules-of-hooks
        provider: useRpcProvider('venom'),
    },
]
