'use-strict'

const { Property } = require('gateway-addon');

class TelnetProperty extends Property {
    constructor(device, conf, ts) {
        super(device, conf.label, conf)
        this.commands = conf.commands;
        this.server = ts;
        
        this.server.Observe(this.commands["response"])
            .subscribe((props) => {
                this.value = props.value;
                this.setCachedValue(this.value)
                this.device.notifyPropertyChanged(this)
            })
        this.server.sendRaw(this.commands["get"])
    }
    booleanTo(type, value) {
        switch (type) {
            case "int":
                return value ? 1 : 0;
            case "setString_getBool":
                return value ? "O" : "F";
        }
        return value
    }
    numberTo(type, value){
        switch(type){
            case "int":
                let range_cmd = parseInt(this.commands["maximum"]) - parseInt(this.commands["minimum"])
                let range_prop = parseInt(this.maximum) - parseInt(this.minimum)
                return parseInt(parseInt(this.commands["minimum"]) + ((parseInt(value) / range_prop) * range_cmd)).toString()
                break;
        }
    }
    setValue(value) {
        switch (this.type) {
            case "boolean":
                value = this.booleanTo(this.commands["datatype"], value);
                break;
            case "number":
                value = this.numberTo(this.commands["datatype"], value)
                break;
        }
        let promise = this.server.Observe(this.commands["response"]).toPromise()
        this.server.send(this.commands["set"], value)
        return promise
    }
}

module.exports = TelnetProperty;