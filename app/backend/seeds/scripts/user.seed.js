const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const dbConstants = require('../../db.constants');

dotenv.config();

class UserSeed {

    _conectionRef

    constructor(conection) {

        this._conectionRef = conection;
    }

    execSeeds = async() => {

        await this._createAdminUser();
        await this._createProfessorUser();
        await this._createStudentUser();

    }

    _createAdminUser = async() => {

        const adminPassword = await this._hashUserPassword(process.env.ADMIN_PASSWORD)
        await this._conectionRef.query(`
            INSERT IGNORE INTO user_entity (id, name, email, password)
            VALUES (1, "${process.env.ADMIN_NAME}", "${process.env.ADMIN_EMAIL}", "${adminPassword}");
        `)

        await this._conectionRef.query(`
            INSERT IGNORE INTO user_role_entity (userEntityId, roleEntityId)
            VALUES (1, ${dbConstants.indicators.role.ADMIN_ROLE})
        `)

    }

    _createProfessorUser = async() => {

        const professorPassword = await this._hashUserPassword(process.env.PROFESSOR_PASSWORD)
        await this._conectionRef.query(`
            INSERT IGNORE INTO user_entity (id, name, email, password)
            VALUES (2, "${process.env.PROFESSOR_NAME}", "${process.env.PROFESSOR_EMAIL}", "${professorPassword}");
        `)

        await this._conectionRef.query(`
            INSERT IGNORE INTO user_role_entity (userEntityId, roleEntityId)
            VALUES (2, ${dbConstants.indicators.role.PROFESSOR_ROLE})
        `)

    }

    _createStudentUser = async() => {

        const studentPassword = await this._hashUserPassword(process.env.STUDENT_PASSWORD)
        await this._conectionRef.query(`
            INSERT IGNORE INTO user_entity (id, name, email, password)
            VALUES (3, "${process.env.STUDENT_NAME}", "${process.env.STUDENT_EMAIL}", "${studentPassword}");
        `)

        await this._conectionRef.query(`
            INSERT IGNORE INTO user_role_entity (userEntityId, roleEntityId)
            VALUES (3, ${dbConstants.indicators.role.STUDENT_ROLE})
        `)
        
    }

    _hashUserPassword = async(password) => {

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        return hash

    }


}

module.exports = UserSeed