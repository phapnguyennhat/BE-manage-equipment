import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePhoneUser1718720287487 implements MigrationInterface {
    name = 'RemovePhoneUser1718720287487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '"2024-06-18T00:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '2024-06-18'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying NOT NULL`);
    }

}
