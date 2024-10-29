import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsModeratedColumnToPropertyTable1730193459793 implements MigrationInterface {
    name = 'AddIsModeratedColumnToPropertyTable1730193459793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Properties" ADD "isModerated" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Properties" DROP COLUMN "isModerated"`);
    }

}
