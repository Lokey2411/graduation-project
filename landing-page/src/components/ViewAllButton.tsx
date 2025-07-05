import { Button } from 'antd';
import { Link } from 'react-router-dom';

const ViewAllButton = ({ path }: { path: string }) => {
	return (
		<Link to={path}>
			<Button type='primary' className='px-12! py-4! '>
				<p className='font-medium text-base leading-full'>View All</p>
			</Button>
		</Link>
	);
};

export default ViewAllButton;
