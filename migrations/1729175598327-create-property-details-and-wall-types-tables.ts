import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePropertyDetailsAndWallTypesTables1729175598327 implements MigrationInterface {
    name = 'CreatePropertyDetailsAndWallTypesTables1729175598327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "WallTypes" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', CONSTRAINT "UQ_33e8a7378ba8a0f17380c92a68d" UNIQUE ("code"), CONSTRAINT "PK_af5ae2b9805df181659678d5588" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PropertyDetails" ("id" SERIAL NOT NULL, "propertyId" integer NOT NULL, "yearBuilt" integer, "squareFootage" integer NOT NULL, "energyEfficiencyRating" character varying, "floor" integer, "totalFloors" integer NOT NULL, "availableFrom" date, "availableTo" date, "maxResidents" integer, "wallTypeId" integer, CONSTRAINT "REL_aec4ddf77602537669b689a5f9" UNIQUE ("propertyId"), CONSTRAINT "PK_5a99d334b541a6772a70b2edb53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD "detailsId" integer`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "UQ_17215811e6be2d048b2eb42a05e" UNIQUE ("detailsId")`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" ADD CONSTRAINT "FK_aec4ddf77602537669b689a5f9f" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" ADD CONSTRAINT "FK_2fc539d1a44f10a2ea5cbbbf065" FOREIGN KEY ("wallTypeId") REFERENCES "WallTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_17215811e6be2d048b2eb42a05e" FOREIGN KEY ("detailsId") REFERENCES "PropertyDetails"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_17215811e6be2d048b2eb42a05e"`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" DROP CONSTRAINT "FK_2fc539d1a44f10a2ea5cbbbf065"`);
        await queryRunner.query(`ALTER TABLE "PropertyDetails" DROP CONSTRAINT "FK_aec4ddf77602537669b689a5f9f"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "UQ_17215811e6be2d048b2eb42a05e"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP COLUMN "detailsId"`);
        await queryRunner.query(`DROP TABLE "PropertyDetails"`);
        await queryRunner.query(`DROP TABLE "WallTypes"`);
    }

}
