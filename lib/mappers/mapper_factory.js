'use-strict'

const LevelMapper = require('./level_mapper')
const BooleanMapper = require('./boolean_mapper')

module.exports = class MapperFactory {
    constructor(typeDescr, commands){
        switch (typeDescr.type) {
            case "boolean":
                return new BooleanMapper(typeDescr, commands);
            case "level":
                return new LevelMapper(typeDescr, commands);
            default:
                return this;
        }
    }
    mozToPlugin(value) {
        return value
    }
    pluginToMoz(value) {
        return value
    }
}