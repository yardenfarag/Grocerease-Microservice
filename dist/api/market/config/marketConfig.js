"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketConfigs = void 0;
exports.marketConfigs = {
    mShuk: {
        branchCollectionName: 'mShukBranches',
        dbName: 'mShuk',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290661400001/PriceFull7290661400001-',
        suffix: '-001.xml.gz',
    },
    mShukSub: {
        branchCollectionName: 'mShukSubBranches',
        dbName: 'mShukSub',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290633800006/PriceFull7290633800006-',
        suffix: '-000.xml.gz',
    },
    victory: {
        branchCollectionName: 'victoryBranches',
        dbName: 'victory',
        baseUrl: 'http://matrixcatalog.co.il/CompetitionRegulationsFiles/latest/7290696200003/PriceFull7290696200003-',
        suffix: '-001.xml.gz',
    },
};
