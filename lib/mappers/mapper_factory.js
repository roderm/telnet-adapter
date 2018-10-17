'use-strict'

const LevelMapper = require('./level_mapper')
const BooleanMapper = require('./boolean_mapper')
const StringMapper = require('./string_mapper')

class DefaultMapper{
    constructor(typeDescr, commands){
        const { label, type, number, description, minimum, maximum } = typeDescr;
        this.descr = { label, type, number, description, minimum, maximum }
        this.descr['@type'] = typeDescr['@type']
        this.descr['enum'] = typeDescr['enum']
    }
    getTypeDescr(){
        return this.descr
    }
    mozToPlugin(value) {
        return value
    }
    pluginToMoz(value) {
        return value
    }
}
module.exports = {
    MapperFactory: (typeDescr, commands) => {
        switch (typeDescr.type) {
            case "boolean":
                return new BooleanMapper(typeDescr, commands);
            case "number":
                return new LevelMapper(typeDescr, commands);
            case "string":
                return new StringMapper(typeDescr, commands);
            default:
                console.log("Type for", typeDescr.type)
                return new DefaultMapper(typeDescr, commands);
        }
    },
    LevelMapper,
    BooleanMapper,
    StringMapper
};