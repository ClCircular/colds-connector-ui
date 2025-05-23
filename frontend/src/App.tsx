import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import dayjs from 'dayjs'
import isBetweenPlugin from 'dayjs/plugin/isBetween'
import { Router } from './router/Router'

const queryClient = new QueryClient()

dayjs.extend(isBetweenPlugin)

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position='top-right' closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
      <Router />
    </QueryClientProvider>
  )
}
