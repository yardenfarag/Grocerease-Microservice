import axios from 'axios'
import fs from 'fs'
import zlib from 'zlib'
import sax from 'sax'
import { Readable } from 'stream'

function downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'accept-encoding': 'gzip,deflate',
            },
        }).then(response => {
            const writeStream = fs.createWriteStream(filePath)
            const inputStream = new Readable({
                read() {
                    this.push(response.data)
                    this.push(null)
                },
            })

            const gunzip = zlib.createGunzip()
            inputStream.pipe(gunzip).pipe(writeStream)

            gunzip.on('error', (error) => {
                console.error('Error during gunzip:', error)
                reject(error)
            })

            writeStream.on('finish', () => {
                resolve()
            })

            writeStream.on('error', (error) => {
                console.error('Error writing to file:', error)
                reject(error)
            });
        }).catch(error => {
            reject(error)
        })
    })
}

async function convertXmlToJson(xmlPath: string): Promise<any[]> {
    const saxStream = sax.createStream(true)
    const products: any[] = []
    let insideProduct = false

    return new Promise((resolve, reject) => {
        let currentProduct: any = null
        let currentElement: string | null = null
        let currentText = ''

        saxStream.on('opentag', (node) => {
            if (node.name === 'Product') {
                currentProduct = {}
                insideProduct = true
            }
            currentElement = node.name
        })

        saxStream.on('text', (text) => {
            currentText = text.trim()
        })

        saxStream.on('closetag', (nodeName) => {
            if (insideProduct && currentElement) {
                currentProduct[currentElement] = currentText
            }

            if (nodeName === 'Product') {
                products.push(currentProduct)
                currentProduct = null
                insideProduct = false
            }

            currentText = ''
            currentElement = null
        })

        saxStream.on('end', () => {
            console.log('Parsing complete!')
            resolve(products);
        })

        saxStream.on('error', (err) => {
            console.error('Error parsing XML:', err)
            reject(err);
        })

        const stream = fs.createReadStream(xmlPath, { encoding: 'utf8' })
        stream.pipe(saxStream)
    })
}

export {
    downloadFile,
    convertXmlToJson
}
