import { Spin } from 'antd';
import clsx from 'clsx';

const TypingIndicator = ({
	className,
	textClassname,
}: {
	readonly className?: string;
	readonly textClassname?: string;
}) => (
	<Spin
		indicator={<span className={clsx('typing-dots w-full', textClassname)}>Typing...</span>}
		className={className}
	/>
);

export default TypingIndicator;
