import {MigrationInterface, QueryRunner} from "typeorm";

export class createJobTable1669039237047 implements MigrationInterface {
    name = 'createJobTable1669039237047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`errorCount\` int NOT NULL DEFAULT '0', \`retryCount\` int NOT NULL, \`statusReason\` varchar(255) NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`statusId\` int NULL, \`hemogramExamId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_entity\` ADD CONSTRAINT \`FK_a244327261a6bdd46382074358b\` FOREIGN KEY (\`statusId\`) REFERENCES \`indicator_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_entity\` ADD CONSTRAINT \`FK_0bd164194b4f568d67d11ce733b\` FOREIGN KEY (\`hemogramExamId\`) REFERENCES \`hemogram_exam_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_entity\` DROP FOREIGN KEY \`FK_0bd164194b4f568d67d11ce733b\``);
        await queryRunner.query(`ALTER TABLE \`job_entity\` DROP FOREIGN KEY \`FK_a244327261a6bdd46382074358b\``);
        await queryRunner.query(`DROP TABLE \`job_entity\``);
    }

}
