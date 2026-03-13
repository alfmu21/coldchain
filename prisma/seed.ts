import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear empresa transportista
  const empresa = await prisma.empresa.upsert({
    where: { rut: '76.123.456-7' },
    update: {},
    create: {
      nombre: 'Transportes Frío Norte SpA',
      rut: '76.123.456-7',
      tipo: 'TRANSPORTISTA',
      direccion: 'Av. Industrial 1234, Santiago',
      telefono: '+56 2 2345 6789',
    },
  })

  console.log('✅ Empresa creada:', empresa.nombre)

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@coldchain.cl' },
    update: {},
    create: {
      email: 'admin@coldchain.cl',
      password: adminPassword,
      nombre: 'Admin',
      apellido: 'ColdChain',
      rol: 'ADMIN',
      empresaId: empresa.id,
    },
  })

  console.log('✅ Usuario admin creado:', admin.email)

  // Crear camiones
  const camion1 = await prisma.camion.upsert({
    where: { patente: 'ABCD-12' },
    update: {},
    create: {
      patente: 'ABCD-12',
      marca: 'Volvo',
      modelo: 'FH16',
      anio: 2022,
      empresaId: empresa.id,
    },
  })

  const camion2 = await prisma.camion.upsert({
    where: { patente: 'WXYZ-34' },
    update: {},
    create: {
      patente: 'WXYZ-34',
      marca: 'Mercedes-Benz',
      modelo: 'Actros',
      anio: 2021,
      empresaId: empresa.id,
    },
  })

  console.log('✅ Camiones creados:', camion1.patente, camion2.patente)

  // Crear sensores
  const sensorTemp1 = await prisma.sensor.upsert({
    where: { codigo: 'SENSOR-TEMP-001' },
    update: {},
    create: {
      codigo: 'SENSOR-TEMP-001',
      camionId: camion1.id,
      tipo: 'TEMPERATURA',
    },
  })

  const sensorHum1 = await prisma.sensor.upsert({
    where: { codigo: 'SENSOR-HUM-001' },
    update: {},
    create: {
      codigo: 'SENSOR-HUM-001',
      camionId: camion1.id,
      tipo: 'HUMEDAD',
    },
  })

  const sensorGPS1 = await prisma.sensor.upsert({
    where: { codigo: 'SENSOR-GPS-001' },
    update: {},
    create: {
      codigo: 'SENSOR-GPS-001',
      camionId: camion1.id,
      tipo: 'GPS',
    },
  })

  const sensorTemp2 = await prisma.sensor.upsert({
    where: { codigo: 'SENSOR-TEMP-002' },
    update: {},
    create: {
      codigo: 'SENSOR-TEMP-002',
      camionId: camion2.id,
      tipo: 'TEMPERATURA',
    },
  })

  console.log('✅ Sensores creados')

  // Crear transporte de ejemplo
  const transporte = await prisma.transporte.upsert({
    where: { codigo: 'TRANS-DEMO-001' },
    update: {},
    create: {
      codigo: 'TRANS-DEMO-001',
      camionId: camion1.id,
      origen: 'Santiago',
      destino: 'Antofagasta',
      estado: 'EN_CURSO',
      fechaInicio: new Date(),
      temperaturaMin: 2,
      temperaturaMax: 8,
      humedadMin: 60,
      humedadMax: 85,
      clienteNombre: 'Supermercados Chile S.A.',
      clienteRut: '99.999.999-9',
      descripcion: 'Carga refrigerada: lácteos y carnes',
    },
  })

  console.log('✅ Transporte de demo creado:', transporte.codigo)

  // Crear algunas lecturas de ejemplo
  const ahora = new Date()
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(ahora.getTime() - i * 5 * 60 * 1000) // cada 5 min
    await prisma.lectura.create({
      data: {
        sensorId: sensorTemp1.id,
        transporteId: transporte.id,
        timestamp,
        temperatura: 3 + Math.random() * 5, // entre 3 y 8
        humedad: 65 + Math.random() * 15,
        latitud: -33.45 + Math.random() * 0.01,
        longitud: -70.65 + Math.random() * 0.01,
      },
    })
  }

  console.log('✅ Lecturas de ejemplo creadas')

  // Crear una alerta de ejemplo
  await prisma.alerta.create({
    data: {
      sensorId: sensorTemp1.id,
      transporteId: transporte.id,
      tipo: 'TEMPERATURA_ALTA',
      severidad: 'MEDIA',
      mensaje: 'Temperatura alta: 9.2°C (máx: 8°C)',
      valor: 9.2,
      umbral: 8,
    },
  })

  console.log('✅ Alerta de ejemplo creada')
  console.log('')
  console.log('🎉 Seed completado!')
  console.log('   Email: admin@coldchain.cl')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
