import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import React from 'react';

export default function ({ Icon }: { Icon: React.FC<Readonly<AntdIconProps>> }) {
	return (
		<div className='group-hover:bg-[rgba(255,255,255,0.3)] bg-[rgba(0,0,0,0.3)] size-20 grid place-items-center  rounded-full'>
			<div className='size-16 bg-black group-hover:bg-white rounded-full grid place-items-center '>
				<Icon className='text-4xl text-white! group-hover:text-black!' />
			</div>
		</div>
	);
}
