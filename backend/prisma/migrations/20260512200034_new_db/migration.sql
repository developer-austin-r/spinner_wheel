-- CreateTable
CREATE TABLE "spinner_amount" (
    "id" SERIAL NOT NULL,
    "spinner_name" TEXT,
    "spinner_amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "won_color" TEXT,
    "user_id" INTEGER,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "spinner_amount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spinner_amount" ADD CONSTRAINT "spinner_amount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
