import clsx from 'clsx'
import { CSSProperties } from 'react'

interface Props {
	title: string
	className?: string
	style?: CSSProperties
}

export default function TextingText({ title, className, style }: Readonly<Props>) {
	return (
		<p
			className={clsx('inline-block animate-texting overflow-hidden ', className)}
			style={{
				animation: `texting 2s steps(${title.length}, end) running alternate`,
				...style,
			}}>
			{title}
		</p>
	)
}
