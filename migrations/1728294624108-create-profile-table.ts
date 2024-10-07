import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfileTable1728294624108 implements MigrationInterface {
    name = 'CreateProfileTable1728294624108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Profile" ("id" SERIAL NOT NULL, "description" character varying NOT NULL DEFAULT '', "companyName" character varying, "commissionRate" numeric(5,2), "fixedFee" integer, "isLookingForApartment" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_89dff233f744d59758158aca1d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "profileId" integer`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_caac395c9a0a9dcdf61d7905c41" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "profileId"`);
        await queryRunner.query(`DROP TABLE "Profile"`);
    }

}
