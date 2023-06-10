import * as React from 'react'

import './PoolsPage.scss'

import { useTvmWallet } from '@/utils'

import {
    Flex, Heading, Label, Tabs, Text, Tile,
} from '@broxus/react-uikit'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { Pools } from '../components/Pools'
import { DexStore } from '@/stores/DexStore'
import { useStore } from '@/hooks/useStore'


export default function PoolsPage(): JSX.Element {
    const intl = useIntl()
    const wallet = useTvmWallet()
    const Dex = useStore(DexStore)

    React.useEffect(() => {
        Dex.weightedPools()
    }, [])
    
    return (
        <div className="pools">
            <Tile type='primary' className="uk-padding-small">
                <Text component='h2' className='uk-text-center'>Pools</Text>
                {/* <Text component='p' className='uk-text-center'>Built on Balancer protocol</Text> */}
            </Tile>
            <Pools />
        </div>
    )
}
