import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717696393389 implements MigrationInterface {
    name = 'Default1717696393389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" text NOT NULL, "image" text NOT NULL, "description" text NOT NULL, "price" text NOT NULL, "rate" text NOT NULL, "category" text NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
