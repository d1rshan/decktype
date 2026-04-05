/* @refresh reload */
import { QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import './app/styles/index.css'
import App from './app/app'
import { queryClient } from './lib/query-client'

const root = document.getElementById('root')

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  root!,
)
