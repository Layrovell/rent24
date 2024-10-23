import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAgentProfileUpdateUserProfileColumns1729670601062 implements MigrationInterface {
    name = 'CreateAgentProfileUpdateUserProfileColumns1729670601062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP CONSTRAINT "FK_9e70fe39bace1b4fe0a96e57203"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`CREATE TABLE "AgentProfile" ("id" SERIAL NOT NULL, "companyName" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "commissionRate" numeric(5,2), "fixedFee" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_81a32f95298da9479cc6b08679" UNIQUE ("userId"), CONSTRAINT "PK_7875fe7aae1f25a584317a36c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "companyName"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "commissionRate"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "fixedFee"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "title" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "agentProfileId" integer`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_db10f2ca26071a0467a8b28c9f0" UNIQUE ("agentProfileId")`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD CONSTRAINT "FK_0ea8af24543da734f41663014e3" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AgentProfile" ADD CONSTRAINT "FK_81a32f95298da9479cc6b08679c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_4a59f7c2150d0f8d1159a129fd5" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_db10f2ca26071a0467a8b28c9f0" FOREIGN KEY ("agentProfileId") REFERENCES "AgentProfile"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_db10f2ca26071a0467a8b28c9f0"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_4a59f7c2150d0f8d1159a129fd5"`);
        await queryRunner.query(`ALTER TABLE "AgentProfile" DROP CONSTRAINT "FK_81a32f95298da9479cc6b08679c"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP CONSTRAINT "FK_0ea8af24543da734f41663014e3"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_db10f2ca26071a0467a8b28c9f0"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "agentProfileId"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "fixedFee" integer`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "commissionRate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "companyName" character varying`);
        await queryRunner.query(`DROP TABLE "AgentProfile"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD CONSTRAINT "FK_9e70fe39bace1b4fe0a96e57203" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
