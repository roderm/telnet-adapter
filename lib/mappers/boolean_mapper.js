'use-strict'

class BooleanMapper {
    constructor(typeDescr, commands){
        this.type = commands["datatype"] ? commands["datatype"] : "boolean";
    }
    mozToPlugin(value){
        switch(this.type){
            case "pioneer_state":
                return value ? "O" : "F"; 
            default:
            return value
        }
    }
    pluginToMoz(value){
        switch(this.type){
            case "pioneer_state":
                return parseInt(value) > 0;
            default:
            return value
        }
    }
}

module.exports = BooleanMapper;