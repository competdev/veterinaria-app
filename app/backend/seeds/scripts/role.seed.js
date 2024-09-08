const dbConstants = require('../../db.constants');

class RoleSeed {

    _conectionRef

    constructor(conection) {

        this._conectionRef = conection;
    }

    execSeeds = async() => {

        await this._createAdminRole();
        await this._createProfessorRole();
        await this._createStudentRole();
    }

    _createAdminRole = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.role.ADMIN_ROLE}, 'Admin role', 'Role with admin privileges', ${dbConstants.indicatorTypes.ROLE})
        `);

    }

    _createProfessorRole = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.role.PROFESSOR_ROLE}, 'Professor role', 'Role with professor privileges', ${dbConstants.indicatorTypes.ROLE})
        `);

    }

    _createStudentRole = async () => {

        await this._conectionRef.query(`
            INSERT IGNORE INTO indicator_entity (id, value, description, indicatorTypeId)
            VALUES (${dbConstants.indicators.role.STUDENT_ROLE}, 'Student role', 'Role with student privileges', ${dbConstants.indicatorTypes.ROLE})
        `);

    }

}

module.exports = RoleSeed