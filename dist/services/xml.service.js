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
exports.convertXmlToJson = exports.downloadFile = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const zlib_1 = __importDefault(require("zlib"));
const sax_1 = __importDefault(require("sax"));
const stream_1 = require("stream");
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        axios_1.default.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'accept-encoding': 'gzip,deflate',
            },
        }).then(response => {
            const writeStream = fs_1.default.createWriteStream(filePath);
            const inputStream = new stream_1.Readable({
                read() {
                    this.push(response.data);
                    this.push(null);
                },
            });
            const gunzip = zlib_1.default.createGunzip();
            inputStream.pipe(gunzip).pipe(writeStream);
            gunzip.on('error', (error) => {
                console.error('Error during gunzip:', error);
                reject(error);
            });
            writeStream.on('finish', () => {
                resolve();
            });
            writeStream.on('error', (error) => {
                console.error('Error writing to file:', error);
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}
exports.downloadFile = downloadFile;
function convertXmlToJson(xmlPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const saxStream = sax_1.default.createStream(true);
        const products = [];
        let insideProduct = false;
        return new Promise((resolve, reject) => {
            let currentProduct = null;
            let currentElement = null;
            let currentText = '';
            saxStream.on('opentag', (node) => {
                if (node.name === 'Product') {
                    currentProduct = {};
                    insideProduct = true;
                }
                currentElement = node.name;
            });
            saxStream.on('text', (text) => {
                currentText = text.trim();
            });
            saxStream.on('closetag', (nodeName) => {
                if (insideProduct && currentElement) {
                    currentProduct[currentElement] = currentText;
                }
                if (nodeName === 'Product') {
                    products.push(currentProduct);
                    currentProduct = null;
                    insideProduct = false;
                }
                currentText = '';
                currentElement = null;
            });
            saxStream.on('end', () => {
                console.log('Parsing complete!');
                resolve(products);
            });
            saxStream.on('error', (err) => {
                console.error('Error parsing XML:', err);
                reject(err);
            });
            const stream = fs_1.default.createReadStream(xmlPath, { encoding: 'utf8' });
            stream.pipe(saxStream);
        });
    });
}
exports.convertXmlToJson = convertXmlToJson;
