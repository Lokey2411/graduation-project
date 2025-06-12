import withLazyOnScroll from '@/commons/withLazyOnScroll';
import { useState } from 'react';

const SignUp = withLazyOnScroll(() => import('./components/Signup'));
const Login = withLazyOnScroll(() => import('./components/Login'));
export default function AuthPage() {
	const [isSignUp, setIsSignUp] = useState(true);
	return isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <Login setIsSignUp={setIsSignUp} />;
}
