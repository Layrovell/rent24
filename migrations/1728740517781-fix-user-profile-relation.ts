import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserProfileRelation1728740517781 implements MigrationInterface {
    name = 'FixUserProfileRelation1728740517781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD CONSTRAINT "UQ_9e70fe39bace1b4fe0a96e57203" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "UserProfile" ADD CONSTRAINT "FK_9e70fe39bace1b4fe0a96e57203" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP CONSTRAINT "FK_9e70fe39bace1b4fe0a96e57203"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP CONSTRAINT "UQ_9e70fe39bace1b4fe0a96e57203"`);
        await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
