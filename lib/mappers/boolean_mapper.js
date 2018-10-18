'use-strict'

class BooleanMapper {
    constructor(typeDescr, commands) {
        const { label, type, number, description, minimum, maximum } = typeDescr;
        this.descr = { label, type, number, description, minimum, maximum }
        this.descr['@type'] = typeDescr['@type']
        this.descr['enum'] = typeDescr['enum']

        this.type = commands["datatype"] ? commands["datatype"] : "boolean";
    }
    getTypeDescr() {
        return this.descr
    }
    mozToPlugin(value) {
        switch (this.type) {
            case "pioneer_state":
                return value ? "O" : "F";
            case "pioneer_mute":
                return value ? "F" : "O";
            default:
                return value
        }
    }
    pluginToMoz(value) {
        switch (this.type) {
            case "pioneer_state":
                return parseInt(value) == 0;
            case "pioneer_mute":
                return parseInt(value) > 0;
            default:
                return value
        }
    }
}

module.exports = BooleanMapper;