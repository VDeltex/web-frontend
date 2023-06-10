import { generatePath } from 'react-router-dom'

export type Params = Record<string, string>

export type URLTokensParams = {
    leftTokenRoot?: string;
    rightTokenRoot?: string;
}

export type URLAddressParam = {
    address: string;
}

export class Route<P extends Params> {

    readonly path: string

    constructor(path: string) {
        this.path = path
    }

    makeUrl(params?: P): string {
        return generatePath(this.path, params)
    }

}


export const appRoutes = {
    home: new Route('/'),
    swap: new Route<URLTokensParams>('/swap'),
    pools: new Route<URLTokensParams>('/pools'),
}
