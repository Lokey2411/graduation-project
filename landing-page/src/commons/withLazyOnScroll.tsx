import React, { ComponentType, lazy, Suspense, useMemo } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { Skeleton } from 'antd';

// Định nghĩa props cho HOC
interface LazyOnScrollProps {
	fallback?: React.ReactNode; // Nội dung hiển thị khi đang tải
	placeholder?: React.ReactNode; // Nội dung hiển thị trước khi scroll tới
	observerOptions?: IntersectionObserverInit; // Tùy chọn cho Intersection Observer
}

const FallbackComponent = () => {
	return (
		<div
			style={{
				height: '100vh',
				display: 'grid',
				placeItems: 'center',
			}}>
			<Skeleton active />
		</div>
	);
};

// HOC nhận một dynamic import function
const withLazyOnScroll = <P extends object>(importFunc: () => Promise<{ default: ComponentType<P> }>) => {
	const LazyComponent = lazy(importFunc);

	const WrappedComponent: React.FC<P & LazyOnScrollProps> = ({
		fallback = <FallbackComponent />,
		placeholder = <FallbackComponent />,
		observerOptions = { threshold: 0.1 },
		...props
	}) => {
		const { ref, isVisible } = useIntersectionObserver(observerOptions);

		// Memoize để tránh re-render không cần thiết
		const content = useMemo(
			() =>
				isVisible ? (
					<Suspense fallback={fallback}>
						<LazyComponent {...(props as P)} />
					</Suspense>
				) : (
					placeholder
				),
			[isVisible, fallback, placeholder, props],
		);

		return <div ref={ref}>{content}</div>;
	};

	// Đặt displayName để dễ debug
	WrappedComponent.displayName = `withLazyOnScroll(${importFunc.name || 'Component'})`;

	return WrappedComponent;
};

export default withLazyOnScroll;
