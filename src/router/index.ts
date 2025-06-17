import userRouter from './users.route'
import categoryRouter from './categories.route'
import productRouter from './products.route'
import authRouter from './auth.route'
import orderRouter from './orders.route'
import chatRouter from './chat.route'
const routers = [
	{
		path: '/users',
		router: userRouter,
	},
	{
		path: '/categories',
		router: categoryRouter,
	},
	{
		path: '/products',
		router: productRouter,
	},
	{
		path: '/auth',
		router: authRouter,
	},
	{
		path: '/orders',
		router: orderRouter,
	},
	{
		path: '/chat',
		router: chatRouter,
	},
]
export default routers
