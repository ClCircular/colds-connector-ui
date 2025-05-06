import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MainLayout } from './layout/MainLayout'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position='top-right' closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
      <MainLayout />
    </QueryClientProvider>
  )
}
