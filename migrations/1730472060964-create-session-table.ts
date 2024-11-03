import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionTable1730472060964 implements MigrationInterface {
    name = 'CreateSessionTable1730472060964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Session" ("id" SERIAL NOT NULL, "refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP, "online" boolean NOT NULL DEFAULT false, "location" character varying, "deviceName" character varying, "userId" integer, CONSTRAINT "PK_b2d57e0f3ce66780706d739e274" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Session" ADD CONSTRAINT "FK_5d4e8000d78793c81fe0b2f38f6" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Session" DROP CONSTRAINT "FK_5d4e8000d78793c81fe0b2f38f6"`);
        await queryRunner.query(`DROP TABLE "Session"`);
    }

}
