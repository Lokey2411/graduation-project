import { NotificationInstance } from 'antd/es/notification/interface';
import useNotificationAntDesign from 'antd/es/notification/useNotification';
import { createContext } from 'react';

export const NotificationContext = createContext({} as NotificationInstance);
export const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [notification, contextHolder] = useNotificationAntDesign();
	return (
		<NotificationContext.Provider value={notification}>
			{children}
			{contextHolder}
		</NotificationContext.Provider>
	);
};
