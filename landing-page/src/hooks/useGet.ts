import { useEffect, useState } from 'react';

export const useGet = <T = any>(
	callback: () => Promise<T>,
	onError?: (error: any) => void,
): { data: T; refetch: () => Promise<void> } => {
	const [data, setData] = useState<T>({} as T);

	const fetchData = async () => {
		try {
			const response = await callback();
			setData(response);
		} catch (error) {
			onError?.(error);
			setData({} as T);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { data, refetch: fetchData };
};
