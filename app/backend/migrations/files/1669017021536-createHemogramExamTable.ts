import {MigrationInterface, QueryRunner} from "typeorm";

export class createHemogramExamTable1669017021536 implements MigrationInterface {
    name = 'createHemogramExamTable1669017021536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`hemogram_exam_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`cellCount\` int NULL, \`userId\` int NULL, \`statusId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hemogram_exam_document_entity\` (\`isResult\` tinyint NOT NULL DEFAULT 0, \`hemogramExamId\` int NOT NULL, \`documentId\` int NOT NULL, PRIMARY KEY (\`hemogramExamId\`, \`documentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_entity\` ADD CONSTRAINT \`FK_0c46baff3b343a9621d0928d639\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_entity\` ADD CONSTRAINT \`FK_efc6c73e6fdedb7a35239d22f88\` FOREIGN KEY (\`statusId\`) REFERENCES \`indicator_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_document_entity\` ADD CONSTRAINT \`FK_10a825e3908817c6a571a955957\` FOREIGN KEY (\`hemogramExamId\`) REFERENCES \`hemogram_exam_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_document_entity\` ADD CONSTRAINT \`FK_6fa3f5c6ce715f3253ce28cd9e0\` FOREIGN KEY (\`documentId\`) REFERENCES \`document_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_document_entity\` DROP FOREIGN KEY \`FK_6fa3f5c6ce715f3253ce28cd9e0\``);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_document_entity\` DROP FOREIGN KEY \`FK_10a825e3908817c6a571a955957\``);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_entity\` DROP FOREIGN KEY \`FK_efc6c73e6fdedb7a35239d22f88\``);
        await queryRunner.query(`ALTER TABLE \`hemogram_exam_entity\` DROP FOREIGN KEY \`FK_0c46baff3b343a9621d0928d639\``);
        await queryRunner.query(`DROP TABLE \`hemogram_exam_document_entity\``);
        await queryRunner.query(`DROP TABLE \`hemogram_exam_entity\``);
    }

}
