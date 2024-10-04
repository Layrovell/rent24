import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityLogTable1728043388089 implements MigrationInterface {
    name = 'ActivityLogTable1728043388089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ActivityLog_activitytype_enum" AS ENUM('registration', 'login', 'logout', 'password_change', 'email_update', 'phone_update', 'account_deactivation', 'property_created', 'property_updated', 'property_deleted', 'property_viewed', 'property_rented', 'property_saved', 'property_unsaved', 'rent_request_submitted', 'rent_request_approved', 'rent_request_rejected', 'rental_payment_made', 'rental_contract_signed', 'agent_commission_set', 'agent_property_managed', 'owner_property_listed', 'owner_property_removed', 'review_submitted', 'review_deleted', 'review_updated', 'notification_received', 'message_sent', 'message_received', 'other')`);
        await queryRunner.query(`CREATE TABLE "ActivityLog" ("id" SERIAL NOT NULL, "activityType" "public"."ActivityLog_activitytype_enum" NOT NULL, "description" character varying, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_399093f65413d2893d656e75e6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP CONSTRAINT "FK_9d3bf2db7fa484cefa22cfcd531"`);
        await queryRunner.query(`DROP TABLE "ActivityLog"`);
        await queryRunner.query(`DROP TYPE "public"."ActivityLog_activitytype_enum"`);
    }

}
