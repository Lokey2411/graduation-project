import { Flex, Image } from 'antd';

const content = [
	'Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region. ',
	'Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging  from consumer.',
];

export default function OurStory() {
	return (
		<div className='-mr-app'>
			<Flex gap={16} justify='space-between' align='center'>
				<div className='animate-to-right flex flex-col gap-10 flex-1/3'>
					<h1 className='text-5xl font-semibold'>Our story</h1>
					<div className='flex flex-col gap-6'>
						{content.map(item => (
							<p key={item} className='text-base'>
								{item}
							</p>
						))}
					</div>
				</div>
				<div className="flex-3/5 animate-to-left">
					<Image
						src='/static/images/about-side-image.jpg'
						className=' size-full object-cover'
					/>
				</div>
			</Flex>
		</div>
	);
}
