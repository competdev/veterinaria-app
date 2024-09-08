const dbConstants = require('../../db.constants');

class IndicatorTypeSeed {

    _conectionRef

    constructor(conection) {
        this._conectionRef = conection;
    }

    execSeeds = async () => {
        await this._createRoleIndicatorType();
        await this._createStatusIndicatorType();
    }

    _createRoleIndicatorType = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_type_entity (id, type, description)
            VALUES (${dbConstants.indicatorTypes.ROLE}, "Role type", "Defines a Role type");
        `)

    }

    _createStatusIndicatorType = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_type_entity (id, type, description)
            VALUES (${dbConstants.indicatorTypes.STATUS}, "Status type", "Defines a Status type");
        `)

    }

}

module.exports = IndicatorTypeSeed