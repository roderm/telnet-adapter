'use-strict'

const { Device } = require('gateway-addon');
const FileLoader = require('./telnet-file-loader');

class TelnetDevice extends Device {
    constructor(adapter, conf){
        super(adapter, conf.host)
        this.fl = new FileLoader(adapter.packageName);
        this.conf = {
            host: conf.host,
            port: conf.port,
            path: conf.commandset
        }
    }
    connect(){
        return new Promise((resolve, reject) => {
            this.fl.loadFile(this.conf.path).then((set) => {
                this.conf.commandset = set;
                resolve();
            }).catch(reject)
        })
    }
}

module.exports = TelnetDevice;