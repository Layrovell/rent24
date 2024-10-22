import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPropertyDelition1729594206856 implements MigrationInterface {
    name = 'FixPropertyDelition1729594206856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" DROP CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53"`);
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" ADD CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" DROP CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53"`);
        await queryRunner.query(`ALTER TABLE "PropertyAmenities" ADD CONSTRAINT "FK_5c07b4c95bef2933b2fc13d5e53" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
