import { ReactElement } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

export const renderWithQuery = (ui: ReactElement) =>
	render(
		<QueryClientProvider
			client={
				new QueryClient({ defaultOptions: { queries: { retry: false } } })
			}
		>
			{ui}
		</QueryClientProvider>
	)
