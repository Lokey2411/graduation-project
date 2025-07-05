import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { theme } from 'antd'
import clsx from 'clsx'

const BooleanField = ({ value, className }: { value: boolean; className: string }) => {
	return (
		<div className={clsx('size-6 text-6', className)} title={(!!value).toString()}>
			{value ? (
				<CheckCircleFilled style={{ color: theme.defaultConfig.token.colorSuccess, fontSize: 24 }} />
			) : (
				<CloseCircleFilled style={{ color: theme.defaultConfig.token.colorError, fontSize: 24 }} />
			)}
		</div>
	)
}

export default BooleanField
