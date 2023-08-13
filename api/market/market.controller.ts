import { Request, Response } from 'express'
import { fetchAndProcessBranches } from './market.service'
import { MarketConfig } from '../../models/marketConfig'

const marketConfigs = [
    {
        branchCollectionName: 'mShukBranches',
        dbName: 'mShuk',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290661400001/PriceFull7290661400001-',
        suffix: '-001.xml.gz',
    },
    {
        branchCollectionName: 'mShukSubBranches',
        dbName: 'mShukSub',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290633800006/PriceFull7290633800006-',
        suffix: '-000.xml.gz',
    },
    {
        branchCollectionName: 'victoryBranches',
        dbName: 'victory',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290696200003/PriceFull7290696200003-',
        suffix: '-001.xml.gz',
    },
]

export async function processMarkets(req: Request, res: Response): Promise<void> {
    try {
        await Promise.all(marketConfigs.map(async (market: MarketConfig) => {
            await fetchAndProcessBranches(market)
        }))
        res.send('Market data processing completed.')
    } catch (err) {
        res.status(500).send({ err: 'Failed to process market data' })
    }
}
