import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TIPO_ALERTA, SEVERIDAD_ALERTA } from '@/lib/constants'

// SSE clients registry
const clients = new Set<ReadableStreamDefaultController>()

export function addSSEClient(controller: ReadableStreamDefaultController) {
  clients.add(controller)
}

export function removeSSEClient(controller: ReadableStreamDefaultController) {
  clients.delete(controller)
}

export function broadcastSSE(event: string, data: unknown) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch {
      clients.delete(controller)
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    // Verificar API key para IoT
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.IOT_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sensorCodigo, transporteCodigo, timestamp, temperatura, humedad, latitud, longitud } = body

    // Buscar sensor y transporte
    const sensor = await prisma.sensor.findUnique({ where: { codigo: sensorCodigo } })
    const transporte = await prisma.transporte.findUnique({ where: { codigo: transporteCodigo } })

    if (!sensor || !transporte) {
      return NextResponse.json({ error: 'Sensor o transporte no encontrado' }, { status: 404 })
    }

    // Guardar lectura
    const lectura = await prisma.lectura.create({
      data: {
        sensorId: sensor.id,
        transporteId: transporte.id,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        temperatura,
        humedad,
        latitud,
        longitud,
      },
    })

    // Actualizar última lectura del sensor
    await prisma.sensor.update({
      where: { id: sensor.id },
      data: { ultimaLectura: new Date() },
    })

    // Verificar umbrales y crear alertas
    const alertas = []

    if (temperatura !== undefined) {
      if (transporte.temperaturaMax && temperatura > transporte.temperaturaMax) {
        alertas.push({
          sensorId: sensor.id,
          transporteId: transporte.id,
          tipo: TIPO_ALERTA.TEMPERATURA_ALTA,
          severidad: temperatura > transporte.temperaturaMax + 5 ? SEVERIDAD_ALERTA.CRITICA : SEVERIDAD_ALERTA.ALTA,
          mensaje: `Temperatura alta: ${temperatura.toFixed(1)}°C (máx: ${transporte.temperaturaMax}°C)`,
          valor: temperatura,
          umbral: transporte.temperaturaMax,
        })
      } else if (transporte.temperaturaMin && temperatura < transporte.temperaturaMin) {
        alertas.push({
          sensorId: sensor.id,
          transporteId: transporte.id,
          tipo: TIPO_ALERTA.TEMPERATURA_BAJA,
          severidad: SEVERIDAD_ALERTA.ALTA,
          mensaje: `Temperatura baja: ${temperatura.toFixed(1)}°C (mín: ${transporte.temperaturaMin}°C)`,
          valor: temperatura,
          umbral: transporte.temperaturaMin,
        })
      }
    }

    if (humedad !== undefined) {
      if (transporte.humedadMax && humedad > transporte.humedadMax) {
        alertas.push({
          sensorId: sensor.id,
          transporteId: transporte.id,
          tipo: TIPO_ALERTA.HUMEDAD_ALTA,
          severidad: SEVERIDAD_ALERTA.MEDIA,
          mensaje: `Humedad alta: ${humedad.toFixed(1)}% (máx: ${transporte.humedadMax}%)`,
          valor: humedad,
          umbral: transporte.humedadMax,
        })
      }
    }

    if (alertas.length > 0) {
      await prisma.alerta.createMany({ data: alertas })

      // Si hay alerta crítica, cambiar estado del transporte
      const tieneCritica = alertas.some((a) => a.severidad === SEVERIDAD_ALERTA.CRITICA)
      if (tieneCritica) {
        await prisma.transporte.update({
          where: { id: transporte.id },
          data: { estado: 'CON_INCIDENTE' },
        })
      }

      broadcastSSE('alerta', { transporteId: transporte.id, alertas })
    }

    broadcastSSE('lectura', { transporteId: transporte.id, lectura })

    return NextResponse.json({ success: true, lecturaId: lectura.id })
  } catch (error) {
    console.error('Error procesando lectura:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
