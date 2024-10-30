import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModeratorRole1730305792145 implements MigrationInterface {
    name = 'AddModeratorRole1730305792145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Users_role_enum" RENAME TO "Users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum" AS ENUM('guest', 'user', 'agent', 'moderator')`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE "public"."Users_role_enum" USING "role"::"text"::"public"."Users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum_old" AS ENUM('guest', 'user', 'agent')`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE "public"."Users_role_enum_old" USING "role"::"text"::"public"."Users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Users_role_enum_old" RENAME TO "Users_role_enum"`);
    }

}
