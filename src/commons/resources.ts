const resourcesName = ['categories', 'users', 'products', 'orders']

export const resources = [
	...resourcesName.map(name => ({
		name,
		list: `/${name}`,
		create: `/${name}/create`,
		edit: `/${name}/edit/:id`,
		show: `/${name}/show/:id`,
		meta: {
			canDelete: true,
		},
	})),
	{
		name: 'chat_messages',
		list: '/chat_messages',
		show: '/chat_messages/show/:id',
	},
	{
		name: 'documents',
		create: '/documents/create',
		list: '/documents',
	},
	{
		name: 'variants',
		create: '/variants/create',
		edit: '/variants/edit/:id',
		show: '/variants/show/:id',
		meta: {
			canDelete: true,
		},
	},
]
