import { useGet } from '@/hooks/useGet';
import ProductService from '@/services/ProductService';
import UserService from '@/services/UserService';
import { IProduct } from '@/types/IProduct';
import { IUser } from '@/types/IUser';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

const GlobalApiContext = createContext({
	allProducts: [] as IProduct[],
	wishlist: [] as any[],
	orders: [] as any[],
	userProfile: {} as IUser,
	refetchProfile: async () => {},
	refetchProducts: async () => {},
	refetchWishlist: async () => {},
	refetchOrders: async () => {},
});

export const useApi = () => useContext(GlobalApiContext);

export const GlobalApiContextProvider = ({ children }: PropsWithChildren) => {
	const { data: allProducts, refetch: refetchProducts } = useGet<IProduct[]>(ProductService.getProducts);
	const { data: wishlist, refetch: refetchWishlist } = useGet(UserService.getFavorite);
	const { data: orders, refetch: refetchOrders } = useGet<any[]>(UserService.getCart);
	const { data: userProfile, refetch: refetchProfile } = useGet<IUser>(UserService.getProfile);
	const contextValue = useMemo(
		() => ({
			allProducts,
			wishlist,
			orders,
			refetchProducts,
			refetchWishlist,
			refetchOrders,
			userProfile,
			refetchProfile,
		}),
		[allProducts],
	);
	if (!allProducts || !wishlist || !orders) return <></>;
	return <GlobalApiContext.Provider value={contextValue}>{children}</GlobalApiContext.Provider>;
};
