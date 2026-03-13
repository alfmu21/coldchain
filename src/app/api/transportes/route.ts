import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCodigo } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const estado = searchParams.get('estado')
  const camionId = searchParams.get('camionId')

  const transportes = await prisma.transporte.findMany({
    where: {
      ...(estado && { estado }),
      ...(camionId && { camionId }),
    },
    orderBy: { createdAt: 'desc' },
    include: { camion: true },
  })

  return NextResponse.json(transportes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { camionId, origen, destino, temperaturaMin, temperaturaMax, humedadMin, humedadMax, descripcion, clienteNombre, clienteRut } = body

    const transporte = await prisma.transporte.create({
      data: {
        codigo: generateCodigo('TRANS'),
        camionId,
        origen,
        destino,
        estado: 'PROGRAMADO',
        temperaturaMin,
        temperaturaMax,
        humedadMin,
        humedadMax,
        descripcion,
        clienteNombre,
        clienteRut,
      },
    })

    return NextResponse.json(transporte, { status: 201 })
  } catch (error) {
    console.error('Error creando transporte:', error)
    return NextResponse.json({ error: 'Error al crear transporte' }, { status: 500 })
  }
}
