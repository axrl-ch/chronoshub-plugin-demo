import { H3Event, createError, useSession, getRequestProtocol } from 'h3'
import { useRuntimeConfig } from '#imports'

export async function requireStudioAuth(event: H3Event) {
  const config = useRuntimeConfig(event)
  const session = await useSession(event, {
    name: 'studio-session',
    password: config.studio?.auth?.sessionSecret,
    cookie: {
      secure: getRequestProtocol(event) === 'https',
      path: '/'
    }
  })
  if (!session?.data?.user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  return session.data.user
}
