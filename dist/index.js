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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("cron");
const node_fetch_1 = __importDefault(require("node-fetch"));
const market_routes_1 = __importDefault(require("./api/market/market.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4444;
const corsOptions = {
    origin: ['http://127.0.0.1:4444', 'http://localhost:4444'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/market', market_routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is live! Now listening on port ${port}`);
});
const job = new cron_1.CronJob('0 12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, node_fetch_1.default)('http://localhost:4444/api/market', {
            method: 'GET',
        });
        if (response.ok) {
            console.log('HTTP request successful');
        }
        else {
            console.error('HTTP request failed');
        }
    }
    catch (error) {
        console.error('Error making HTTP request:', error);
    }
}));
job.start();
