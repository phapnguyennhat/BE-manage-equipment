import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1718718574548 implements MigrationInterface {
    name = 'AddUserPhone1718718574548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_f91337a182c92d0af3fd648d63e"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_046005366edf5f730f258103787"`);
        await queryRunner.query(`ALTER TABLE "cartItem" DROP CONSTRAINT "FK_4d24e752857aeed1b2d5160be14"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '"2024-06-18T00:00:00.000Z"'`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_f91337a182c92d0af3fd648d63e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_046005366edf5f730f258103787" FOREIGN KEY ("userId_approve") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartItem" ADD CONSTRAINT "FK_4d24e752857aeed1b2d5160be14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartItem" DROP CONSTRAINT "FK_4d24e752857aeed1b2d5160be14"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_046005366edf5f730f258103787"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_f91337a182c92d0af3fd648d63e"`);
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "borrowDate" SET DEFAULT '2024-06-17'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "cartItem" ADD CONSTRAINT "FK_4d24e752857aeed1b2d5160be14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_046005366edf5f730f258103787" FOREIGN KEY ("userId_approve") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_f91337a182c92d0af3fd648d63e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
