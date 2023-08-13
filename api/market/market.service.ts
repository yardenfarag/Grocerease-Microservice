import fs from 'fs'
import { getCollection } from '../../services/db.service'
import { downloadFile, convertXmlToJson } from '../../services/xml.service'
import { formatDate } from '../../services/util.service'
import { MarketConfig } from '../../models/marketConfig'
import { Branch } from '../../models/branch'
import { Market } from '../../models/market'
import { Document, WithId } from 'mongodb'

async function processBranches(branches: Branch[], market: MarketConfig): Promise<void> {
    for (const branch of branches) {
        const currentDate = new Date()
        const formattedDate = formatDate(currentDate)
        const url = `${market.baseUrl}${branch.branch_id}-${formattedDate + branch.timestamp}${market.suffix}`
        const filePath = `./data/${branch.branch_id + branch.branch_brand}.xml`
        try {
            await downloadFile(url, filePath)
            const jsonFromXml = await convertXmlToJson(filePath)
            const finalJson: Market = {
                products: jsonFromXml,
                loc: { type: 'Point', coordinates: [branch.lat, branch.lng] },
                branch_brand: branch.branch_brand,
                branch_name: branch.branch_name,
                branch_id: branch.branch_id,
                imgUrl: branch.imgUrl,
                timestamp: branch.timestamp,
            };
            await saveToDatabase(finalJson, market.dbName)
            console.log(`Branch with id ${branch.branch_id} processed successfully.`)
        } catch (error) {
            console.error(`Error processing branch with id ${branch.branch_id}:`, error)
        }
    }
}

async function deleteXmlFiles(branches: Branch[]): Promise<void> {
    for (const branch of branches) {
        const filePath = `./data/${branch.branch_id + branch.branch_brand}.xml`
        try {
            fs.unlinkSync(filePath)
            console.log(`XML file for branch with id ${branch.branch_id} deleted.`)
        } catch (error) {
            console.error(`Error deleting XML file for branch with id ${branch.branch_id}:`, error)
        }
    }
}

async function saveToDatabase(data: Market, dbName: string): Promise<void> {
    try {
        const collection = await getCollection(dbName)
        const filter = { branch_id: data.branch_id }
        const update = { $set: data }
        const options = { upsert: true }
        const result = await collection.updateOne(filter, update, options)

        if (result.upsertedCount === 1) {
            console.log(`Data for branch with id ${data.branch_id} inserted.`)
        } else {
            console.log(`Data for branch with id ${data.branch_id} updated.`)
        }
    } catch (error) {
        console.error('Error saving data to the database:', error)
        throw error
    }
}

export async function fetchAndProcessBranches(market: MarketConfig): Promise<void> {
    try {
        const branchesCollection = await getCollection(market.branchCollectionName);
        const branches = (await branchesCollection.find({}).toArray()).map(mapToBranch)
        await processBranches(branches, market)
        await deleteXmlFiles(branches)
    } catch (error) {
        console.error('Error fetching and processing branches:', error)
        throw error
    }
}

function mapToBranch(doc: WithId<Document>): Branch {
    const { _id, branch_brand, branch_name, branch_id, imgUrl, timestamp, lat, lng } = doc
    return {
        _id: _id.toHexString(),
        branch_brand,
        branch_name,
        branch_id,
        imgUrl,
        timestamp,
        lat,
        lng
    }
}
