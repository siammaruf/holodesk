import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProfileVisitedRealmIdsType1746686400000 implements MigrationInterface {
  name = 'FixProfileVisitedRealmIdsType1746686400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change visited_realm_ids from text to varchar and make nullable
    // This aligns the DB schema with the entity definition and fixes
    // the TypeORM simple-array vs manual string-split mismatch.
    await queryRunner.query(`
      ALTER TABLE "profiles"
      ALTER COLUMN "visited_realm_ids" TYPE character varying,
      ALTER COLUMN "visited_realm_ids" DROP NOT NULL,
      ALTER COLUMN "visited_realm_ids" SET DEFAULT ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "profiles"
      ALTER COLUMN "visited_realm_ids" TYPE text,
      ALTER COLUMN "visited_realm_ids" SET NOT NULL,
      ALTER COLUMN "visited_realm_ids" SET DEFAULT ''
    `);
  }
}
