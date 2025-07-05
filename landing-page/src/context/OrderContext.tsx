import { createContext, useMemo } from 'react';

export const OrderContext = createContext(
	{} as {
		orderPrice: number;
		setOrderPrice: (n: number) => void;
		orderAddress: string;
		setOrderAddress: (address: string) => void;
	},
);
export const OrderContextProvider = ({ children }: { children: React.ReactNode }) => {
	const orderPriceStr = localStorage.getItem('orderPrice');
	const orderPrice = orderPriceStr !== null ? +orderPriceStr : 0;
	const orderAddress = localStorage.getItem('orderAddress') ?? '';
	const setOrderPrice = (value: number) => localStorage.setItem('orderPrice', value.toString());
	const setOrderAddress = (value: string) => localStorage.setItem('orderAddress', value);
	const value = useMemo(() => {
		return { orderPrice, setOrderPrice, orderAddress, setOrderAddress };
	}, [orderPrice, orderAddress]);
	return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
