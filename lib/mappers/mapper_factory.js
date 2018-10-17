'use-strict'

const LevelMapper = require('./level_mapper')
const BooleanMapper = require('./boolean_mapper')

class DefaultMapper{
    constructor(typeDescr, commands){
        
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
            default:
                console.log("Type for", typeDescr.type)
                return new DefaultMapper(typeDescr, commands);
        }
    },
    LevelMapper,
    BooleanMapper
};