import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAndUpdatedDateToWallAndDetailsTables1729245960860 implements MigrationInterface {
    name = 'AddCreatedAndUpdatedDateToWallAndDetailsTables1729245960860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyDetails" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "WallTypes" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "WallTypes" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41"`);
        await queryRunner.query(`ALTER TABLE "Properties" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41"`);
        await queryRunner.query(`ALTER TABLE "Properties" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WallTypes" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "WallTypes" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" DROP COLUMN "createdAt"`);
    }

}
