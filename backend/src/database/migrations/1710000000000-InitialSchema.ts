import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" SERIAL NOT NULL,
        "role_name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "roles_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "roles_role_name_key" UNIQUE ("role_name"),
        CONSTRAINT "roles_slug_key" UNIQUE ("slug")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "phone_number" TEXT,
        "role_id" INTEGER NOT NULL,
        "deleted_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "users_email_key" UNIQUE ("email"),
        CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "users_role_id_idx" ON "users" ("role_id")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email")');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spinner_amount" (
        "id" SERIAL NOT NULL,
        "spinner_name" TEXT,
        "spinner_amount" DOUBLE PRECISION,
        "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        "won_color" TEXT,
        "user_id" INTEGER,
        "updated_at" TIMESTAMP(3),
        "deleted_at" TIMESTAMP(3),
        CONSTRAINT "spinner_amount_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "spinner_amount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spinner_colors" (
        "id" SERIAL NOT NULL,
        "color_name" TEXT NOT NULL,
        "color_slug" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "spinner_colors_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "spinner_colors_color_slug_key" UNIQUE ("color_slug")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "spinners" (
        "id" SERIAL NOT NULL,
        "spinner_name" TEXT NOT NULL,
        "base_amount" DOUBLE PRECISION NOT NULL,
        "set_amount" DOUBLE PRECISION NOT NULL,
        "user_id" INTEGER,
        "active_status" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP(3),
        CONSTRAINT "spinners_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "spinners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "selected_spinner_values" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "selected_color" INTEGER NOT NULL,
        "amount" VARCHAR(255) NOT NULL,
        "spinner_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP(3),
        CONSTRAINT "selected_spinner_values_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "selected_spinner_values_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "selected_spinner_values_selected_color_fkey" FOREIGN KEY ("selected_color") REFERENCES "spinner_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "selected_spinner_values_spinner_id_fkey" FOREIGN KEY ("spinner_id") REFERENCES "spinners"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "selected_spinner_values"');
    await queryRunner.query('DROP TABLE IF EXISTS "spinners"');
    await queryRunner.query('DROP TABLE IF EXISTS "spinner_colors"');
    await queryRunner.query('DROP TABLE IF EXISTS "spinner_amount"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
    await queryRunner.query('DROP TABLE IF EXISTS "roles"');
  }
}
