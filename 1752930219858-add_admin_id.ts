import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminId1752930219858 implements MigrationInterface {
    name = 'AddAdminId1752930219858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "added_by" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD "added_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "added_by"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "added_by"`);
    }

}
