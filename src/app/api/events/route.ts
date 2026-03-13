import { NextRequest } from 'next/server'
import { addSSEClient, removeSSEClient } from '../lecturas/route'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      addSSEClient(controller)

      // Enviar heartbeat inicial
      controller.enqueue(encoder.encode('event: connected\ndata: {}\n\n'))

      // Heartbeat cada 30 segundos
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode('event: heartbeat\ndata: {}\n\n'))
        } catch {
          clearInterval(interval)
          removeSSEClient(controller)
        }
      }, 30000)

      // Limpiar al cerrar conexión
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        removeSSEClient(controller)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
