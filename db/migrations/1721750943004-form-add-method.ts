import { MigrationInterface, QueryRunner } from "typeorm";

export class FormAddMethod1721750943004 implements MigrationInterface {
    name = 'FormAddMethod1721750943004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."form_method_enum" AS ENUM('office', 'destination')`);
        await queryRunner.query(`ALTER TABLE "form" ADD "method" "public"."form_method_enum"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '"2024-07-23T00:00:00.000Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '2024-07-02'`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "method"`);
        await queryRunner.query(`DROP TYPE "public"."form_method_enum"`);
    }

}
