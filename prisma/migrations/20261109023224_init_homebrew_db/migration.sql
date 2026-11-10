-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SistemaRPG" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "editora" TEXT,

    CONSTRAINT "SistemaRPG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homebrew" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "sistemaId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Homebrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SistemaRPG_nome_key" ON "SistemaRPG"("nome");

-- AddForeignKey
ALTER TABLE "Homebrew" ADD CONSTRAINT "Homebrew_sistemaId_fkey" FOREIGN KEY ("sistemaId") REFERENCES "SistemaRPG"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homebrew" ADD CONSTRAINT "Homebrew_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
