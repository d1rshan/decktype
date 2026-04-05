import { cors } from '@elysiajs/cors'

import { env } from '../../config/env'

export const corsPlugin = cors({
  origin: env.frontendOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
