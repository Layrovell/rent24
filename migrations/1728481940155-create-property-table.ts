import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePropertyTable1728481940155 implements MigrationInterface {
    name = 'CreatePropertyTable1728481940155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Properties_propertytype_enum" AS ENUM('room', 'apartment', 'house')`);
        await queryRunner.query(`CREATE TABLE "Properties" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "propertyType" "public"."Properties_propertytype_enum", "pricePerMonth" numeric, "pricePerDay" numeric, "longTerm" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_0840069eb699a18f3ad6e829ae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_1e5daa6dab52bcd3a1daf81db41"`);
        await queryRunner.query(`DROP TABLE "Properties"`);
        await queryRunner.query(`DROP TYPE "public"."Properties_propertytype_enum"`);
    }

}
