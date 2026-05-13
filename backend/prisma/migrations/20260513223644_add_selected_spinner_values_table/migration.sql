-- CreateTable
CREATE TABLE "selected_spinner_values" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "selected_color" INTEGER NOT NULL,
    "amount" VARCHAR(255) NOT NULL,
    "spinner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "selected_spinner_values_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "selected_spinner_values" ADD CONSTRAINT "selected_spinner_values_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selected_spinner_values" ADD CONSTRAINT "selected_spinner_values_selected_color_fkey" FOREIGN KEY ("selected_color") REFERENCES "spinner_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selected_spinner_values" ADD CONSTRAINT "selected_spinner_values_spinner_id_fkey" FOREIGN KEY ("spinner_id") REFERENCES "spinners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
