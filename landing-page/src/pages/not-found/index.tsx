import { Breadcrumb, Button, Result } from 'antd';
import Link from 'antd/es/typography/Link';

export default function NotFound() {
	return (
		<div className='mx-app mt-20'>
			<Breadcrumb
				className='animate-to-right'
				items={[
					{
						title: <Link href='/'>Home</Link>,
					},
					{
						title: '404 Error',
					},
				]}
			/>
			<Result
				status='404'
				title='404'
				subTitle='Sorry, the page you visited does not exist.'
				extra={
					<Button type='primary' href='/' size='large'>
						Back Home
					</Button>
				}
			/>
		</div>
	);
}
