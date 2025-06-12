import { Skeleton } from 'antd';
import React, { useState, useRef, useEffect, Suspense } from 'react';

export function withLazyLoad<Props extends Record<string, any>>(
	dynamicImport: () => Promise<{ default: React.ComponentType<Props> }>,
	threshold = 0.1,
) {
	const LazyComponent = dynamic(dynamicImport, {
		ssr: false,
		loading: () => (
			<div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
				<Skeleton active />
			</div>
		),
	});
	const LazyLoadedComponent: React.FC<Props> = props => {
		const [isVisible, setIsVisible] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const observer = new IntersectionObserver(
				entries => {
					const entry = entries[0];
					// Chỉ set isVisible nếu sentinel thực sự vào viewport và không phải lúc đầu
					if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
						setIsVisible(true);
						if (ref.current) {
							observer.unobserve(ref.current);
						}
					}
				},
				{ root: null, threshold },
			);

			// Trì hoãn observe một chút để tránh trigger ngay khi load
			const timeout = setTimeout(() => {
				if (ref.current) {
					observer.observe(ref.current);
				}
			}, 100); // Delay nhẹ để viewport ổn định

			return () => {
				clearTimeout(timeout);
				if (ref.current) {
					observer.unobserve(ref.current);
				}
			};
		}, []);

		return (
			<>
				{/* Sentinel ở đây, nhưng chỉ trigger khi scroll thực sự đến */}
				<div ref={ref} style={{ height: isVisible ? '0' : '1px', marginTop: isVisible ? '0' : '50vh' }} />
				{isVisible && <LazyComponent {...props} />}
			</>
		);
	};

	LazyLoadedComponent.displayName = 'withLazyLoadComponent';
	return LazyLoadedComponent;
}
