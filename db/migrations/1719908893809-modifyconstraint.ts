import { MigrationInterface, QueryRunner } from "typeorm";

export class Modifyconstraint1719908893809 implements MigrationInterface {
    name = 'Modifyconstraint1719908893809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartItem" DROP CONSTRAINT "FK_33b3d3cb544d36568b95939b4c1"`);
        await queryRunner.query(`ALTER TABLE "equipment" ALTER COLUMN "urlImg" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '"2024-07-02T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "cartItem" ADD CONSTRAINT "FK_33b3d3cb544d36568b95939b4c1" FOREIGN KEY ("equipId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartItem" DROP CONSTRAINT "FK_33b3d3cb544d36568b95939b4c1"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '2024-06-18'`);
        await queryRunner.query(`ALTER TABLE "equipment" ALTER COLUMN "urlImg" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cartItem" ADD CONSTRAINT "FK_33b3d3cb544d36568b95939b4c1" FOREIGN KEY ("equipId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
