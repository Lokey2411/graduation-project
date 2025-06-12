import { Image } from 'antd';

export default function AuthImage({ className }: { readonly className?: string }) {
	return <Image src='/static/images/login-side-image.png' className={className} />;
}
