'use-strict'

class BooleanMapper {
    constructor(typeDescr, commands){
        this.type = commands["datatype"] ? commands["datatype"] : "boolean";
    }
    mozToPlugin(value){
        switch(this.type){
            case "pioneer_state":
                return value ? "O" : "F"; 
            case "pioneer_mute":
                return value ? "F" : "O"; 
            default:
            return value
        }
    }
    pluginToMoz(value){
        switch(this.type){
            case "pioneer_state", "pioneer_mute":
                return parseInt(value) > 0;
            default:
            return value
        }
    }
}

module.exports = BooleanMapper;