import { useNotification } from '@/hooks/useNotification';
import makeRequest from '@/services/makeRequest';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';

const DeleteButton = ({
	resource,
	id,
	params,
	refetch,
}: {
	resource: string;
	id: number;
	params?: any;
	refetch: any;
}) => {
	const notification = useNotification();
	const handleDelete = () => {
		makeRequest
			.delete(`/${resource}/${id}`, {
				data: params?.body ?? {},
			})
			.then(res => {
				if (res.status === 200) {
					notification.success({
						message: 'Success',
						description: 'Delete successfully',
					});
					refetch();
				} else {
					notification.error({
						message: 'Error',
						description: 'Delete failed<br>Error: ' + res.data,
					});
				}
			})
			.catch(error => {
				notification.error({
					message: 'Error',
					description: 'Delete failed\nError: ' + error.message,
				});
			});
	};
	return (
		<Popconfirm
			title='Are you sure delete this item?'
			onConfirm={handleDelete}
			okText='Delete'
			cancelText='Cancel'
			okButtonProps={{ danger: true }}
			getPopupContainer={(trigger: any) => trigger.parentElement}>
			<Button title='Delete this item' danger className='!py-2 group'>
				<DeleteOutlined className='group-hover:animate-bounce' />
			</Button>
		</Popconfirm>
	);
};

export default DeleteButton;
