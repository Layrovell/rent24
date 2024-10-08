import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserActivityLogCascadeDeleting1728392084342 implements MigrationInterface {
    name = 'UpdateUserActivityLogCascadeDeleting1728392084342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "profileId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "profileId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
