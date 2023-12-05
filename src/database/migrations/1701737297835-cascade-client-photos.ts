import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeClientPhotos1701737297835 implements MigrationInterface {
    name = 'CascadeClientPhotos1701737297835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" ADD "clientId" integer`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_127a5532d24658ac9442b901286" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_127a5532d24658ac9442b901286"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "clientId"`);
    }

}
