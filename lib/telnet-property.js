'use-strict'

const { Property } = require('gateway-addon');
const { MapperFactory } = require('./mappers/mapper_factory')

class TelnetProperty extends Property {
    constructor(device, conf, ts) {
        super(device, conf.label, conf)
        this.commands = conf.commands;
        this.server = ts;
        this.mapper = MapperFactory(conf, this.commands);
        this.server.Observe(this.commands["response"])
            .subscribe((props) => {
                this.value = this.mapper.pluginToMoz(props.value);
                this.setCachedValue(this.value)
                this.device.notifyPropertyChanged(this)
            })
        this.server.sendRaw(this.commands["get"])
    }
    setValue(value) {
        value = this.mapper.mozToPlugin(value)
        return new Promise((resolve, reject) => {
            this.server.Observe(this.commands["response"]).toPromise()
                .then((val) => {
                    resolve(this.mapper.pluginToMoz(val))
                })
                .catch(reject)
            this.server.send(this.commands["set"], value)
        })
    }
    getValue() {
        return new Promise((resolve, reject) => {
            this.server.Observe(this.commands["response"]).toPromise()
                .then((val) => {
                    resolve(this.mapper.pluginToMoz(val))
                })
                .catch(reject)
            this.server.sendRaw(this.commands["get"])
        })
    }
}

module.exports = TelnetProperty;