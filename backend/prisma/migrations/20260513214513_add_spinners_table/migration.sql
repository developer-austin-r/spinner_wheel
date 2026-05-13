-- CreateTable
CREATE TABLE "spinners" (
    "id" SERIAL NOT NULL,
    "spinner_name" TEXT NOT NULL,
    "base_amount" DOUBLE PRECISION NOT NULL,
    "set_amount" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER,
    "active_status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "spinners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spinners" ADD CONSTRAINT "spinners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
