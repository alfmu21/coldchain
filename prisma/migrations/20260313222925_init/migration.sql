-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "empresaId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "camiones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patente" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "anio" INTEGER,
    "empresaId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "camiones_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sensores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "camionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaInstalacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaLectura" DATETIME,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sensores_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "camiones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transportes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "camionId" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "estado" TEXT NOT NULL,
    "temperaturaMin" REAL,
    "temperaturaMax" REAL,
    "humedadMin" REAL,
    "humedadMax" REAL,
    "descripcion" TEXT,
    "clienteNombre" TEXT,
    "clienteRut" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transportes_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "camiones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lecturas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sensorId" TEXT NOT NULL,
    "transporteId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperatura" REAL,
    "humedad" REAL,
    "latitud" REAL,
    "longitud" REAL,
    "sincronizado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lecturas_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lecturas_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "transportes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sensorId" TEXT NOT NULL,
    "transporteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "valor" REAL,
    "umbral" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reconocida" BOOLEAN NOT NULL DEFAULT false,
    "reconocidaPor" TEXT,
    "reconocidaEn" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alertas_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "alertas_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "transportes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transporteId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "fechaEmision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultado" TEXT NOT NULL,
    "observaciones" TEXT,
    "txHash" TEXT,
    "smartContract" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificados_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "transportes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_rut_key" ON "empresas"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "camiones_patente_key" ON "camiones"("patente");

-- CreateIndex
CREATE UNIQUE INDEX "sensores_codigo_key" ON "sensores"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "transportes_codigo_key" ON "transportes"("codigo");

-- CreateIndex
CREATE INDEX "lecturas_sensorId_timestamp_idx" ON "lecturas"("sensorId", "timestamp");

-- CreateIndex
CREATE INDEX "lecturas_transporteId_timestamp_idx" ON "lecturas"("transporteId", "timestamp");

-- CreateIndex
CREATE INDEX "alertas_transporteId_timestamp_idx" ON "alertas"("transporteId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_codigo_key" ON "certificados"("codigo");
