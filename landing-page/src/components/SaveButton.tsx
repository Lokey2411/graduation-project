import { useNotification } from '@/hooks/useNotification';
import makeRequest from '@/services/makeRequest';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SaveButton = ({
	id,
	resources,
	params,
	refetch,
}: {
	id: number;
	resources: string;
	params: any;
	refetch: any;
}) => {
	const notification = useNotification();
	return (
		<Button
			className='py-2! px-4 group'
			title='Save changes'
			onClick={() => {
				// Assuming makeRequest is a function that handles API requests
				makeRequest
					.patch(`${resources}/${id}`, params)
					.then(res => {
						if (res.status === 200) {
							refetch()
								.then(() => {
									notification.success({
										message: 'Success',
										description: 'Changes saved successfully',
									});
								})
								.catch(() => {
									notification.error({
										message: 'Error',
										description: 'Save failed',
									});
								});
						} else {
							notification.error({
								message: 'Error',
								description: 'Save failed<br>Error: ' + res.data,
							});
						}
					})
					.catch(error => {
						console.error('Save failed:', error);
						notification.error({
							message: 'Error',
							description: 'Save failed<br>Error: ' + error.message,
						});
					});
			}}>
			<SaveOutlined className='group-hover:animate-bounce' />
		</Button>
	);
};

export default SaveButton;
