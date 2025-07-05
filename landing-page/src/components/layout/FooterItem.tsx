import { Flex } from 'antd'
import React from 'react'

export default function FooterItem({ items }: { readonly items: React.ReactNode[] }) {
	return (
		<Flex gap={16} vertical>
			{items.map((item, index) => (
				<React.Fragment key={index + 0}>{item}</React.Fragment>
			))}
		</Flex>
	)
}
