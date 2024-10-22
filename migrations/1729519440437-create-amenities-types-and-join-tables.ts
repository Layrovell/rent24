import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAmenitiesTypesAndJoinTables1729519440437 implements MigrationInterface {
    name = 'CreateAmenitiesTypesAndJoinTables1729519440437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Amenities" ("id" SERIAL NOT NULL, "code" character varying(100) NOT NULL, "description" character varying NOT NULL DEFAULT '', "unit" character varying(50), "valueType" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59daf8581ec3846d2e95a6daf7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PropertyAmenities" ("id" SERIAL NOT NULL, "value" json NOT NULL, "propertyId" integer, "amenityId" integer, CONSTRAINT "PK_a38f0f0b1c1a3719eab1fe75166" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" ADD CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" ADD CONSTRAINT "FK_6d3fc0ca7b84adc2379a27fa644" FOREIGN KEY ("amenityId") REFERENCES "Amenities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" DROP CONSTRAINT "FK_6d3fc0ca7b84adc2379a27fa644"`);
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" DROP CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53"`);
        await queryRunner.query(`DROP TABLE "PropertyAmenities"`);
        await queryRunner.query(`DROP TABLE "Amenities"`);
    }

}
