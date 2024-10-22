import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateActivityTypesAndUserRoles1728331455850 implements MigrationInterface {
    name = 'UpdateActivityTypesAndUserRoles1728331455850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`ALTER TYPE "public"."Users_role_enum" RENAME TO "Users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum" AS ENUM('guest', 'user', 'agent')`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE "public"."Users_role_enum" USING "role"::"text"::"public"."Users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "userProfileId" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."ActivityLog_activitytype_enum" RENAME TO "ActivityLog_activitytype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ActivityLog_activitytype_enum" AS ENUM('registration', 'login', 'logout', 'password_change', 'profile_update', 'email_update', 'phone_update', 'account_deactivation', 'property_created', 'property_updated', 'property_deleted', 'property_viewed', 'property_rented', 'property_saved', 'property_unsaved', 'rent_request_submitted', 'rent_request_approved', 'rent_request_rejected', 'rental_payment_made', 'rental_contract_signed', 'agent_commission_set', 'agent_property_managed', 'owner_property_listed', 'owner_property_removed', 'review_submitted', 'review_deleted', 'review_updated', 'notification_received', 'message_sent', 'message_received', 'other')`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ALTER COLUMN "activityType" TYPE "public"."ActivityLog_activitytype_enum" USING "activityType"::"text"::"public"."ActivityLog_activitytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ActivityLog_activitytype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41"`);
        await queryRunner.query(`CREATE TYPE "public"."ActivityLog_activitytype_enum_old" AS ENUM('registration', 'login', 'logout', 'password_change', 'email_update', 'phone_update', 'account_deactivation', 'property_created', 'property_updated', 'property_deleted', 'property_viewed', 'property_rented', 'property_saved', 'property_unsaved', 'rent_request_submitted', 'rent_request_approved', 'rent_request_rejected', 'rental_payment_made', 'rental_contract_signed', 'agent_commission_set', 'agent_property_managed', 'owner_property_listed', 'owner_property_removed', 'review_submitted', 'review_deleted', 'review_updated', 'notification_received', 'message_sent', 'message_received', 'other')`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ALTER COLUMN "activityType" TYPE "public"."ActivityLog_activitytype_enum_old" USING "activityType"::"text"::"public"."ActivityLog_activitytype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."ActivityLog_activitytype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ActivityLog_activitytype_enum_old" RENAME TO "ActivityLog_activitytype_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "userProfileId" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum_old" AS ENUM('guest', 'user', 'owner', 'agent')`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" TYPE "public"."Users_role_enum_old" USING "role"::"text"::"public"."Users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Users_role_enum_old" RENAME TO "Users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_caac395c9a0a9dcdf61d7905c41" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
