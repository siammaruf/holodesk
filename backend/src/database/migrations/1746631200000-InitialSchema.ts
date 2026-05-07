import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1746631200000 implements MigrationInterface {
  name = 'InitialSchema1746631200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "username" character varying(100) NOT NULL,
        "avatar_url" text,
        "google_id" character varying(255),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_google_id" UNIQUE ("google_id"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // profiles
    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "user_id" uuid NOT NULL,
        "skin" character varying(10) NOT NULL DEFAULT '009',
        "visited_realm_ids" text NOT NULL DEFAULT '',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_profiles" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_profiles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // realms
    await queryRunner.query(`
      CREATE TABLE "realms" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "owner_id" uuid NOT NULL,
        "name" character varying(100) NOT NULL,
        "share_id" uuid NOT NULL,
        "map_data" jsonb NOT NULL,
        "only_owner" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_realms_share_id" UNIQUE ("share_id"),
        CONSTRAINT "PK_realms" PRIMARY KEY ("id"),
        CONSTRAINT "FK_realms_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // realm_embeddings
    await queryRunner.query(`
      CREATE TABLE "realm_embeddings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "realm_id" uuid NOT NULL,
        "content_type" character varying(50) NOT NULL,
        "content" text NOT NULL,
        "embedding" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_realm_embeddings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_realm_embeddings_realm_id" FOREIGN KEY ("realm_id") REFERENCES "realms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "realm_embeddings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "realms"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
