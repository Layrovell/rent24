import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateActivitiesTable1728931938161 implements MigrationInterface {
    name = 'CreateActivitiesTable1728931938161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Activities" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_d0420e2486be2f093b17d9eb617" UNIQUE ("code"), CONSTRAINT "PK_68241637da2837e6d5a4db6f806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP COLUMN "activityType"`);
        await queryRunner.query(`DROP TYPE "public"."ActivityLog_activitytype_enum"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD "activityId" integer`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD CONSTRAINT "FK_a514644d19c40d1f25fdcf178d8" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP CONSTRAINT "FK_a514644d19c40d1f25fdcf178d8"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP COLUMN "activityId"`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" DROP COLUMN "createdAt"`);
        await queryRunner.query(`CREATE TYPE "public"."ActivityLog_activitytype_enum" AS ENUM('registration', 'login', 'logout', 'password_change', 'profile_update', 'email_update', 'phone_update', 'account_deactivation', 'property_created', 'property_updated', 'property_deleted', 'property_viewed', 'property_rented', 'property_saved', 'property_unsaved', 'rent_request_submitted', 'rent_request_approved', 'rent_request_rejected', 'rental_payment_made', 'rental_contract_signed', 'agent_commission_set', 'agent_property_managed', 'owner_property_listed', 'owner_property_removed', 'review_submitted', 'review_deleted', 'review_updated', 'notification_received', 'message_sent', 'message_received', 'other')`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD "activityType" "public"."ActivityLog_activitytype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "ActivityLog" ADD "timestamp" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "Activities"`);
    }

}
