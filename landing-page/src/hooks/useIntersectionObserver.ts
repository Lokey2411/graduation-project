import { useEffect, useState, useRef } from 'react';

const useIntersectionObserver = (options?: IntersectionObserverInit) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.unobserve(entry.target);
			}
		}, options);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [options]);

	return { ref, isVisible };
};

export default useIntersectionObserver;
