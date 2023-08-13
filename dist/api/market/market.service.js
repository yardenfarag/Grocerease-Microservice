"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndProcessBranches = void 0;
const fs_1 = __importDefault(require("fs"));
const db_service_1 = require("../../services/db.service");
const xml_service_1 = require("../../services/xml.service");
function processBranches(branches, market) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const branch of branches) {
            const currentDate = new Date();
            // const formattedDate = formatDate(currentDate)
            const formattedDate = '20230813';
            const url = `${market.baseUrl}${branch.branch_id}-${formattedDate + branch.timestamp}${market.suffix}`;
            const filePath = `./data/${branch.branch_id + branch.branch_brand}.xml`;
            try {
                yield (0, xml_service_1.downloadFile)(url, filePath);
                const jsonFromXml = yield (0, xml_service_1.convertXmlToJson)(filePath);
                const finalJson = {
                    products: jsonFromXml,
                    loc: { type: 'Point', coordinates: [branch.lat, branch.lng] },
                    branch_brand: branch.branch_brand,
                    branch_name: branch.branch_name,
                    branch_id: branch.branch_id,
                    imgUrl: branch.imgUrl,
                    timestamp: branch.timestamp,
                };
                yield saveToDatabase(finalJson, market.dbName);
                console.log(`Branch with id ${branch.branch_id} processed successfully.`);
            }
            catch (error) {
                console.error(`Error processing branch with id ${branch.branch_id}:`, error);
            }
        }
    });
}
function deleteXmlFiles(branches) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const branch of branches) {
            const filePath = `./data/${branch.branch_id + branch.branch_brand}.xml`;
            try {
                fs_1.default.unlinkSync(filePath);
                console.log(`XML file for branch with id ${branch.branch_id} deleted.`);
            }
            catch (error) {
                console.error(`Error deleting XML file for branch with id ${branch.branch_id}:`, error);
            }
        }
    });
}
function saveToDatabase(data, dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield (0, db_service_1.getCollection)(dbName);
            const filter = { branch_id: data.branch_id };
            const update = { $set: data };
            const options = { upsert: true };
            const result = yield collection.updateOne(filter, update, options);
            if (result.upsertedCount === 1) {
                console.log(`Data for branch with id ${data.branch_id} inserted.`);
            }
            else {
                console.log(`Data for branch with id ${data.branch_id} updated.`);
            }
        }
        catch (error) {
            console.error('Error saving data to the database:', error);
            throw error;
        }
    });
}
function fetchAndProcessBranches(market) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const branchesCollection = yield (0, db_service_1.getCollection)(market.branchCollectionName);
            const branches = (yield branchesCollection.find({}).toArray()).map(mapToBranch);
            yield processBranches(branches, market);
            yield deleteXmlFiles(branches);
        }
        catch (error) {
            console.error('Error fetching and processing branches:', error);
            throw error;
        }
    });
}
exports.fetchAndProcessBranches = fetchAndProcessBranches;
function mapToBranch(doc) {
    const { _id, branch_brand, branch_name, branch_id, imgUrl, timestamp, lat, lng } = doc;
    return {
        _id: _id.toHexString(),
        branch_brand,
        branch_name,
        branch_id,
        imgUrl,
        timestamp,
        lat,
        lng
    };
}
