'use-strict'

class LevelMapper {
    constructor(typeDescr, commands){
        const { label, type, number, description, minimum, maximum } = typeDescr;
        this.descr = { label, type, number, description, minimum, maximum }
        this.descr['@type'] = typeDescr['@type']
        this.descr['enum'] = typeDescr['enum']

        this.type = commands["datatype"] ? commands["datatype"] : "boolean";
        this.plMin = commands["minimum"] ? parseInt(commands["minimum"]) : 0;
        this.plMax = commands["maximum"] ? parseInt(commands["maximum"]) : 100;
        this.mozMin = minimum ? parseInt(minimum) : 0;
        this.mozMax = maximum ? parseInt(maximum) : 100;
    }
    getTypeDescr(){
        return this.descr
    }
    mozToPlugin(value){
        switch(this.type){
            default:
            return parseInt(this.plMin + ((parseInt(value) / (this.mozMax - this.mozMin)) * (this.plMax - this.plMin)))
        }
    }
    pluginToMoz(value){
        switch(this.type){
            default:
            return parseInt(this.mozMin + ((parseInt(value) / (this.plMax - this.plMin)) * (this.mozMax - this.mozMin)))
        }
    }
}

module.exports = LevelMapper;