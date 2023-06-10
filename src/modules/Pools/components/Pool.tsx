import * as React from 'react'
import { observer } from "mobx-react-lite"
import { useStore } from '@/hooks/useStore'
import { DexStore } from '@/stores/DexStore'
import { Card, Flex, Text } from '@broxus/react-uikit'
import { Address } from 'everscale-inpage-provider'

export default function PoolInner({ tokenAddress, iPool, iToken }: { tokenAddress: Address, iPool: number, iToken: number }): JSX.Element {
    const Dex = useStore(DexStore)
    const [token, setToken] = React.useState('')

    React.useEffect(() => {
        if (!token)
            Dex.getNameToken(tokenAddress, iPool, iToken).then((item) => {
                setToken(item)
            })
    }, [])

    return (
        <div>
            {token ?
                <Text>{token}</Text>
                :
                <Text>Loading...</Text>
            }
        </div>
    )
}

export const Pool = observer(PoolInner)
