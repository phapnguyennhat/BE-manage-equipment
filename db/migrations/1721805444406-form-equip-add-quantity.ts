import { MigrationInterface, QueryRunner } from "typeorm";

export class FormEquipAddQuantity1721805444406 implements MigrationInterface {
    name = 'FormEquipAddQuantity1721805444406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forms_equips" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '"2024-07-24T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."form_status_enum" RENAME TO "form_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."form_status_enum" AS ENUM('Duyệt', 'Chưa Duyệt', 'Từ Chối')`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" TYPE "public"."form_status_enum" USING "status"::"text"::"public"."form_status_enum"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" SET DEFAULT 'Chưa Duyệt'`);
        await queryRunner.query(`DROP TYPE "public"."form_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "method" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "method" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."form_status_enum_old" AS ENUM('approved', 'notApproved', 'reject')`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" TYPE "public"."form_status_enum_old" USING "status"::"text"::"public"."form_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" SET DEFAULT 'notApproved'`);
        await queryRunner.query(`DROP TYPE "public"."form_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."form_status_enum_old" RENAME TO "form_status_enum"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '2024-07-23'`);
        await queryRunner.query(`ALTER TABLE "forms_equips" DROP COLUMN "quantity"`);
    }

}
