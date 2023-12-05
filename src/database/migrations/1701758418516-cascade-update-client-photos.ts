import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeUpdateClientPhotos1701758418516 implements MigrationInterface {
    name = 'CascadeUpdateClientPhotos1701758418516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_127a5532d24658ac9442b901286"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_127a5532d24658ac9442b901286" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_127a5532d24658ac9442b901286"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_127a5532d24658ac9442b901286" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
