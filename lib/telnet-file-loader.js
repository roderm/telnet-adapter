'use-strict'

const TelnetDatabase = require('./telnet-db');
const https = require('https');
const stream = require('stream');

let instance = [];

class FileLoader {
    constructor(pkgName) {
        if (instance[pkgName] == null) {
            this.DB = new TelnetDatabase(pkgName);
            instance[pkgName] = this;
        }
        return instance[pkgName];
    }
    /**
     * Load file either from db or url
     * @param {string} path - url path from config
     * @returns {Promise(object,error)} 
     */
    loadFile(path, devID) {
        return new Promise((resolve, reject) => {
            this.DB.getCommandSetup(path, devID)
                .then(resolve)
                .catch((err) => {
                    if (err == 'Database not open') {
                        reject(err)
                    } else {
                        this.DB.clearDeviceSet(devID).then(
                            () => {
                                this.dlFileContent(path).then((fileContent) => {
                                    this.DB.setCommandSetup(path, devID, fileContent)
                                    resolve(fileContent)
                                }).catch(reject)
                            }
                        ).catch(reject)
                    }
                })
        })
    }

    /**
     * Download file and store in db for future-use
     * @param {string} path 
     * @returns {Promise(object,error)} - parsed Json object 
     */
    dlFileContent(path) {
        return new Promise((resolve, reject) => {
            let body = '';
            console.log("Download commandset from '" + path + "'")
            https.get(path, (response) => {
                if (response.statusCode !== 200) {
                    reject('Response status was ' + response.statusCode)
                    return
                }
                const contentType = response.headers['content-type'];
                response.setEncoding('utf8');
                response.on('data', (chunk) => { body += chunk; });

                response.on('end', () => {
                    try {
                        let json = JSON.parse(body);
                        if(typeof json == 'string'){
                            json = JSON.parse(json);
                        }
                        resolve(json);
                    } catch (e) {
                        reject(e)
                    }
                    return;
                })
            }).on('error', (e) => {
                reject(e)
            })
        })
    }
}

module.exports = FileLoader;