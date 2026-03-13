// Simulador IoT para desarrollo
// Envía lecturas ficticias al endpoint /api/lecturas

const API_URL = 'http://localhost:3000/api/lecturas'
const IOT_API_KEY = process.env.IOT_API_KEY ?? 'iot-dev-key-12345'

const SENSOR_CODIGO = 'SENSOR-TEMP-001'
const TRANSPORTE_CODIGO = 'TRANS-DEMO-001'

// Temperatura base con variación gradual
let temperaturaBase = 4.0
let humedadBase = 70.0

async function sendLectura() {
  // Variación aleatoria pequeña
  temperaturaBase += (Math.random() - 0.5) * 0.5
  humedadBase += (Math.random() - 0.5) * 2

  // Mantener dentro de rangos razonables
  temperaturaBase = Math.max(-5, Math.min(15, temperaturaBase))
  humedadBase = Math.max(50, Math.min(95, humedadBase))

  const payload = {
    sensorCodigo: SENSOR_CODIGO,
    transporteCodigo: TRANSPORTE_CODIGO,
    timestamp: new Date().toISOString(),
    temperatura: Math.round(temperaturaBase * 10) / 10,
    humedad: Math.round(humedadBase * 10) / 10,
    latitud: -33.45 + Math.random() * 0.5,
    longitud: -70.65 + Math.random() * 0.5,
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': IOT_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    const time = new Date().toLocaleTimeString('es-CL')
    console.log(`[${time}] Lectura enviada: T=${payload.temperatura}°C H=${payload.humedad}%`, data.success ? '✅' : '❌')
  } catch (error) {
    console.error('Error enviando lectura:', error)
  }
}

console.log('🌡️  Simulador IoT iniciado')
console.log(`   URL: ${API_URL}`)
console.log(`   Sensor: ${SENSOR_CODIGO}`)
console.log(`   Transporte: ${TRANSPORTE_CODIGO}`)
console.log('   Enviando lecturas cada 10 segundos...')
console.log('')

// Enviar primera lectura inmediatamente
sendLectura()

// Luego cada 10 segundos
setInterval(sendLectura, 10000)
