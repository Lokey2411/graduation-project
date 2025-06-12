import { GitHubBanner, Refine } from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import { useNotificationProvider } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import routerBindings, { DocumentTitleHandler, UnsavedChangesNotifier } from '@refinedev/react-router'
import { App as AntdApp } from 'antd'
import { BrowserRouter } from 'react-router'
import { ColorModeContextProvider } from './contexts/color-mode'
import { resources } from './commons/resources'
import { dataProvider } from './services/dataProvider'
import AppRoute from './routes'

function App() {
	return (
		<BrowserRouter>
			<GitHubBanner />
			<RefineKbarProvider>
				<ColorModeContextProvider>
					<AntdApp>
						<DevtoolsProvider>
							<Refine
								dataProvider={dataProvider}
								notificationProvider={useNotificationProvider}
								routerProvider={routerBindings}
								resources={resources}
								options={{
									syncWithLocation: true,
									warnWhenUnsavedChanges: true,
									useNewQueryKeys: true,
									projectId: 'PL1utc-deWPY1-Ik8vat',
								}}>
								<AppRoute />

								<RefineKbar />
								<UnsavedChangesNotifier />
								<DocumentTitleHandler />
							</Refine>
							<DevtoolsPanel />
						</DevtoolsProvider>
					</AntdApp>
				</ColorModeContextProvider>
			</RefineKbarProvider>
		</BrowserRouter>
	)
}

export default App
