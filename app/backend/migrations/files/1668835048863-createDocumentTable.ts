import {MigrationInterface, QueryRunner} from "typeorm";

export class createDocumentTable1668835048863 implements MigrationInterface {
    name = 'createDocumentTable1668835048863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fileName\` varchar(255) NOT NULL, \`fileHash\` varchar(255) NOT NULL, \`fileType\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`document_entity\` ADD CONSTRAINT \`FK_8f7e0f0efb6be9a5aca5485d948\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_entity\` DROP FOREIGN KEY \`FK_8f7e0f0efb6be9a5aca5485d948\``);
        await queryRunner.query(`DROP TABLE \`document_entity\``);
    }

}
