'use-strict'

class StringMapper {
    constructor(typeDescr, commands) {
        const { label, type, number, description, minimum, maximum } = typeDescr;
        this.descr = { label, type, number, description, minimum, maximum, 'enum': [], '@type': [] }
        this.descr['@type'] = typeDescr['@type']

        this.type = commands["datatype"] ? commands["datatype"] : "string";
        this.commands = commands;

        switch (this.type) {
            case "keyvalue_list":
                this.descr['enum'] = commands["list"].map((v) => v["value"])
                break;
            default:
                this.descr['enum'] = typeDescr['enum']
                break;
        }
    }
    getTypeDescr() {
        return this.descr
    }
    mozToPlugin(value) {
        switch (this.type) {
            case "keyvalue_list":
                let item = this.commands["list"].find((item) => item['value'] == value)
                if(item){
                    return item["key"]
                }
                return value
            default:
                return value
        }
    }
    pluginToMoz(value) {
        switch (this.type) {
            case "keyvalue_list":
                let item = this.commands["list"].find((item) => item['key'] == value)
                if(item){
                    return item["value"]
                }
                return value
            default:
                return value
        }
    }
}

module.exports = StringMapper;