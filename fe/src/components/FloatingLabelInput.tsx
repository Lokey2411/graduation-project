import { Input, InputProps } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

interface FloatingLabelInputProps extends InputProps {
	label: string // Nội dung của label
	name: string // Tên của input (dùng để xác định movingPlaceholders)
	className?: string // ClassName tùy chỉnh cho Input
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, name, className, ...props }) => {
	const [movingPlaceholders, setMovingPlaceholders] = useState(false)
	const addMovingPlaceholders: InputProps['onFocus'] = e => {
		if (!props.value) setMovingPlaceholders(true)
	}

	const removeMovingPlaceholders: InputProps['onBlur'] = e => {
		if (!props.value) setMovingPlaceholders(false)
	}

	const handleChange: InputProps['onChange'] = e => {
		setMovingPlaceholders(!!props.value)
	}

	useEffect(() => {
		setMovingPlaceholders(!!props.value)
	}, [props])

	return (
		<div className='relative'>
			<label
				htmlFor={name}
				className={clsx(
					'absolute bottom-0 z-10 text-xl select-none bg-white mb-2 px-2 ml-2 text-black dark:bg-input-dark dark:text-white',
					{
						'-translate-y-full': movingPlaceholders,
					},
				)}>
				{label}
			</label>
			<Input
				className={clsx('text-2xl border-0 border-b border-b-gray-500 focus:border', className)}
				onFocus={addMovingPlaceholders}
				onBlur={removeMovingPlaceholders}
				name={name}
				onChange={handleChange}
				{...props}
			/>
		</div>
	)
}

export default FloatingLabelInput
