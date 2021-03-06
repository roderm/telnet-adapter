'use-strict'

const { Device } = require('gateway-addon');
const FileLoader = require('./telnet-file-loader');
const TelnetService = require('./telnet-service');
const TelnetProperty = require('./telnet-property')

class TelnetDevice extends Device {
    constructor(adapter, conf){
        super(adapter, conf.host)
        this.fl = new FileLoader(adapter.packageName);
        this.cmd_path = conf.commandset;
        this.telnetService = new TelnetService({
            host: conf.host,
            port: parseInt(conf.port),
            timeout: 1000*60,
        });
    }

    /**
     * Connect Properties given from Commandset to TelnetProperties
     */
    connect(){
        return new Promise((resolve, reject) => {
            this.fl.loadFile(this.cmd_path, this.id).then((set) => {
                this.telnetService.connect().then(() => {
                    this.commandset = set;
                    for(let prop of set){
                        this.properties.set(prop.label, new TelnetProperty(this, prop, this.telnetService))
                    }
                    resolve();
                }).catch(reject)
            }).catch(reject)
        })
    }
    unload(){
        this.telnetService.unload()
    }
}

module.exports = TelnetDevice;