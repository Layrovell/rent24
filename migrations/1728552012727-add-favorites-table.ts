import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritesTable1728552012727 implements MigrationInterface {
    name = 'AddFavoritesTable1728552012727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Favorites" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "propertyId" integer, CONSTRAINT "PK_83cd0162b05b05e9a88cb3e5ad0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Favorites" ADD CONSTRAINT "FK_649880d4eb31b62af8f1f75b6cc" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Favorites" ADD CONSTRAINT "FK_f6a4b9d76d3bab3b36284e18558" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Favorites" DROP CONSTRAINT "FK_f6a4b9d76d3bab3b36284e18558"`);
        await queryRunner.query(`ALTER TABLE "Favorites" DROP CONSTRAINT "FK_649880d4eb31b62af8f1f75b6cc"`);
        await queryRunner.query(`DROP TABLE "Favorites"`);
    }

}
