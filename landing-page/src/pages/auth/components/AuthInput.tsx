import { Input, InputProps } from 'antd';

export default function (props: InputProps) {
	return (
		<Input
			className='border-0! border-b! border-black! rounded-none! px-0! outline-0! shadow-none! pb-2! placeholder:opacity-40 text-base!'
			{...props}
		/>
	);
}
