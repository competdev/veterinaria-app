import {MigrationInterface, QueryRunner} from "typeorm";

export class createRoles1668805444711 implements MigrationInterface {
    name = 'createRoles1668805444711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`indicator_type_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`indicator_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`indicatorTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role_entity\` (\`userEntityId\` int NOT NULL, \`roleEntityId\` int NOT NULL, INDEX \`IDX_6fb4229045b292d6cb8aaadbf6\` (\`userEntityId\`), INDEX \`IDX_dfbefda798de7129d06377f669\` (\`roleEntityId\`), PRIMARY KEY (\`userEntityId\`, \`roleEntityId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`indicator_entity\` ADD CONSTRAINT \`FK_cf152aa75dd8de36bd88ae5448c\` FOREIGN KEY (\`indicatorTypeId\`) REFERENCES \`indicator_type_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role_entity\` ADD CONSTRAINT \`FK_6fb4229045b292d6cb8aaadbf6e\` FOREIGN KEY (\`userEntityId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_role_entity\` ADD CONSTRAINT \`FK_dfbefda798de7129d06377f669e\` FOREIGN KEY (\`roleEntityId\`) REFERENCES \`indicator_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role_entity\` DROP FOREIGN KEY \`FK_dfbefda798de7129d06377f669e\``);
        await queryRunner.query(`ALTER TABLE \`user_role_entity\` DROP FOREIGN KEY \`FK_6fb4229045b292d6cb8aaadbf6e\``);
        await queryRunner.query(`ALTER TABLE \`indicator_entity\` DROP FOREIGN KEY \`FK_cf152aa75dd8de36bd88ae5448c\``);
        await queryRunner.query(`DROP INDEX \`IDX_dfbefda798de7129d06377f669\` ON \`user_role_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_6fb4229045b292d6cb8aaadbf6\` ON \`user_role_entity\``);
        await queryRunner.query(`DROP TABLE \`user_role_entity\``);
        await queryRunner.query(`DROP TABLE \`indicator_entity\``);
        await queryRunner.query(`DROP TABLE \`indicator_type_entity\``);
    }

}
