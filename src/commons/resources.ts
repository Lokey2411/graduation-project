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
	/**
	 * list: categories: api: GET /categories
	 * create: categories/create -> api: POST /categories
	 * edit: categories/edit/:id -> api: PUT /categories/:id
	 * show: categories/show/:id -> api: GET /categories/:id
	 */
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
