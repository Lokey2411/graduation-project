import { colors } from './commons/colors';
import { GlobalApiContextProvider } from './context/ApiContext';
import { NotificationContextProvider } from './context/NotificationContext';
import { OrderContextProvider } from './context/OrderContext';
import AppRouter from './routes';
import { ConfigProvider as AntDesignProvider, App as AntdApp } from 'antd';

function App() {
	return (
		<OrderContextProvider>
			<NotificationContextProvider>
				<GlobalApiContextProvider>
					<AntdApp>
						<AntDesignProvider
							theme={{
								token: {},
								components: {
									Button: {
										colorPrimary: colors['secondary-bg-2'],
										colorText: colors['secondary-text'],
									},
								},
							}}>
							<AppRouter />
						</AntDesignProvider>
					</AntdApp>
				</GlobalApiContextProvider>
			</NotificationContextProvider>
		</OrderContextProvider>
	);
}

export default App;
