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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMarkets = void 0;
const market_service_1 = require("./market.service");
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
];
function processMarkets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all(marketConfigs.map((market) => __awaiter(this, void 0, void 0, function* () {
                yield (0, market_service_1.fetchAndProcessBranches)(market);
            })));
            res.send('Market data processing completed.');
        }
        catch (err) {
            res.status(500).send({ err: 'Failed to process market data' });
        }
    });
}
exports.processMarkets = processMarkets;
