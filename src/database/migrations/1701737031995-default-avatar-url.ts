import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultAvatarUrl1701737031995 implements MigrationInterface {
    name = 'DefaultAvatarUrl1701737031995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "avatar" SET DEFAULT 'https://placehold.co/200x200'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "avatar" SET DEFAULT 'http://default-url'`);
    }

}
