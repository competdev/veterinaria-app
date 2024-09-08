const RoleSeed = require('./role.seed');
const StatusSeed = require('./status.seed');


class IndicatorSeed {

    _conectionRef

    constructor(conection) {
        this._conectionRef = conection;
    }
    
    execSeeds = async () => {
        await new RoleSeed(this._conectionRef).execSeeds();
        await new StatusSeed(this._conectionRef).execSeeds();
    }
}

module.exports = IndicatorSeed