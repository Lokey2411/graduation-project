export interface IProduct {
	id: number;
	name: string;
	description: string;
	price: string;
	discount?: string;
	priceAfterDiscount: string;
	category_id: number;
	isBestSale: boolean;
	isDelete: number;
}
