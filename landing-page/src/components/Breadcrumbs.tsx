import React from 'react'
import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom';


const Breadcrumbs: React.FC = () => {
	const location = useLocation()
	const pathnames = location.pathname.split('/').filter(x => x)

	return (
		<div className='px-app py-4'>
			<Breadcrumb
				items={[
					{
						title: <Link to='/'>Home</Link>,
					},
					...pathnames.map((value, index) => ({
						title:
							index === pathnames.length - 1 ? (
								<span className='font-semibold'>{value}</span>
							) : (
								<Link to={value}>{decodeURIComponent(value)}</Link>
							),
					})),
				]}
			/>
		</div>
	)
}

export default Breadcrumbs
