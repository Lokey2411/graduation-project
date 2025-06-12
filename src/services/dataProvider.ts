import {
	BaseKey,
	BaseRecord,
	CreateParams,
	DataProvider,
	GetListParams,
	GetListResponse,
	GetOneParams,
} from '@refinedev/core'
import { UpdateParams } from '@refinedev/core/dist/hooks/data/useUpdate'
import refineDataProvider from '@refinedev/simple-rest'
import { getToken } from '@/commons/getToken'

const defaultProvider = refineDataProvider('/services/api')

const createHeader = (token: string) => {
	return {
		Authorization: `Bearer ${token}`,
	}
}

export const dataProvider: DataProvider = {
	...defaultProvider,
	getList: async <TData extends BaseRecord = BaseRecord>({
		resource,
		pagination,
	}: GetListParams): Promise<GetListResponse<TData>> => {
		const { current = 1, pageSize = 10 } = pagination ?? {}

		const queryParams = new URLSearchParams({
			page: (current - 1).toString(),
			size: pageSize.toString(),
		})

		const response = await defaultProvider.getOne<TData[]>({
			resource,
			id: '',
			meta: {
				headers: {
					...createHeader(`${getToken()}`),
				},
				body: { ...queryParams },
			},
		})
		return {
			data: response.data.map(item => ({ ...item })),
			total: response.data.length,
		}
	},

	getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams) => {
		const response = await defaultProvider.getOne<TData>({
			resource,
			id,
			meta: {
				headers: {
					...createHeader(`${getToken()}`),
				},
			},
		})
		return { data: { ...response.data } }
	},

	create: async <TData extends BaseRecord, TVariables = {}>({ resource, variables }: CreateParams<TVariables>) => {
		const response = await defaultProvider.create<TData, TVariables>({
			resource,
			variables,
			meta: {
				headers: {
					...createHeader(`${getToken()}`),
				},
			},
		})
		return { data: response.data }
	},

	update: async <TData extends BaseRecord, TVariables = {}, TError = any>({
		resource,
		id,
		...rest
	}: UpdateParams<TData, TError, TVariables>) => {
		const stringResource = `${resource}`
		const baseKeyId = id as BaseKey
		const response = await defaultProvider.update<TData, TVariables>({
			variables: rest as TVariables,
			resource: stringResource,
			id: baseKeyId,
			...rest,
			meta: {
				method: 'put',
				headers: {
					...createHeader(`${getToken()}`),
				},
			},
		})

		return { data: response.data }
	},
	deleteOne: async ({ resource, id }) => {
		console.log(id)
		return await defaultProvider.deleteOne({
			resource,
			id,
			meta: {
				headers: {
					...createHeader(`${getToken()}`),
				},
			},
		})
	},
	getMany: async ({ resource, ids }) => {
		return await defaultProvider.getMany({
			resource,
			ids,
			meta: {
				headers: {
					...createHeader(`${getToken()}`),
				},
			},
		})
	},
	getApiUrl: () => defaultProvider.getApiUrl(),
}
