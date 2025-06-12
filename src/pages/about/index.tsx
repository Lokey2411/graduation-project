import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const OurStory = withLazyOnScroll(() => import('./components/OurStory'));
const Commenter = withLazyOnScroll(() => import('./components/Commenter'));
const Services = withLazyOnScroll(() => import('@/components/Services'));
export default function AboutPage() {
	return (
		<div className='mx-app'>
			<Breadcrumb
				className='mt-20!'
				items={[
					{
						title: <Link to='/'>Home</Link>,
					},
					{
						title: 'About',
					},
				]}
			/>

			<div className='flex flex-col gap-40 mt-10'>
				<OurStory />
				<Commenter />
				<Services />
			</div>
		</div>
	);
}
