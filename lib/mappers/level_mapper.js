'use-strict'

class LevelMapper {
    constructor(typeDescr, commands){
        this.type = commands["datatype"] ? commands["datatype"] : "boolean";
        this.plMin = commands["minimum"] ? parseInt(commands["minimum"]) : 0;
        this.plMax = commands["maximum"] ? parseInt(commands["maximum"]) : 100;
        this.mozMin = typeDescr["minimum"] ? parseInt(typeDescr["minimum"]) : 0;
        this.mozMax = typeDescr["maximum"] ? parseInt(typeDescr["maximum"]) : 100;
    }
    mozToPlugin(value){
        switch(this.type){
            default:
            return parseInt(this.plMin + ((parseInt(value) / (this.mozMax - this.mozMin)) * this.plMax - this.plMin))
        }
    }
    pluginToMoz(value){
        switch(this.type){
            default:
            return parseInt(this.mozMin + ((parseInt(value) / (this.plMax - this.plMin)) * this.mozMax - this.mozMin))
        }
    }
}

module.exports = LevelMapper;