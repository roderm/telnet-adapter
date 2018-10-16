'use-strict'

const { Property } = require('gateway-addon');
const MapperFactory = require('./mappers/mapper_factory')

class TelnetProperty extends Property {
    constructor(device, conf, ts) {
        super(device, conf.label, conf)
        this.commands = conf.commands;
        this.server = ts;
        this.mapper = new MapperFactory(conf, this.commands);
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
        let promise = this.server.Observe(this.commands["response"]).toPromise()
        this.server.send(this.commands["set"], value)
        return promise
    }
}

module.exports = TelnetProperty;