import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717663704089 implements MigrationInterface {
    name = 'Default1717663704089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" text NOT NULL, "image" text NOT NULL, "description" text NOT NULL, "price" text NOT NULL, "rate" text NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" SERIAL NOT NULL, "user_id" text NOT NULL, "product_id" text NOT NULL, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
