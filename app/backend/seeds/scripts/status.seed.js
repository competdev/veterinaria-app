const dbConstants = require('../../db.constants');

class StatusSeed {

    _conectionRef

    constructor(conection) {

        this._conectionRef = conection;
    }

    execSeeds = async() => {

        await this._createAwaitingStatus();
        await this._createReadyStatus();
        await this._createRunningStatus();
        await this._createFinishedStatus();
        await this._createSuccessStatus();
        await this._createFailedStatus();

    }

    _createAwaitingStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.AWAITING}, 'Aguardando o processamento', 'Awaiting status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }

    _createReadyStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.READY}, 'Pronto para o processamento', 'Ready  status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }

    _createRunningStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.RUNNING}, 'Processando', 'Running status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }

    _createFinishedStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.FINISHED}, 'Processamento finalizado', 'Finished status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }

    _createSuccessStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.SUCCESS}, 'Processado com sucesso', 'Success status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }

    _createFailedStatus = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.status.FAILED}, 'Falha no processamento', 'Failed status', ${dbConstants.indicatorTypes.STATUS})
        `);

    }
}

module.exports = StatusSeed