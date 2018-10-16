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
    loadFile(path) {
        return new Promise((resolve, reject) => {
            this.DB.getCommandSetup(path)
                .then(resolve)
                .catch((err) => {
                    if (err == 'Database not open') {
                        reject(err)
                    } else {
                        this.dlFileContent(path).then((fileContent) => {
                            this.DB.setCommandSetup(path, JSON.stringify(fileContent))
                            resolve(fileContent)
                        }).catch(reject)
                    }
                })
        })
    }
    dlFileContent(path) {
        return new Promise((resolve, reject) => {
            let body = '';
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
                        const json = JSON.parse(body);
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