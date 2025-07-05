import { NotificationContext } from '@/context/NotificationContext';
import { useContext } from 'react';

export const useNotification = () => {
	return useContext(NotificationContext);
};
