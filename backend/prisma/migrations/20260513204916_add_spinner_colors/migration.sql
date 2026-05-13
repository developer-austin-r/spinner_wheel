-- CreateTable
CREATE TABLE "spinner_colors" (
    "id" SERIAL NOT NULL,
    "color_name" TEXT NOT NULL,
    "color_slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spinner_colors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spinner_colors_color_slug_key" ON "spinner_colors"("color_slug");
