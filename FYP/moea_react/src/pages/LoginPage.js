// React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Supabase
import supabase from '../config/supabaseClient';

// CSS
import LoginPageCSS from './LoginPage.module.css';

import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

// Icons
// import 'boxicons';
// import arrowIcon from '../images/arrow-back.svg';

const LoginPage = ({ onLoginSuccess }) => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		// Clean previous errors
		setLoginError('');

		// Use signIn for email/password authentication
		let { user, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		console.log('Login attempt:', { user, error });

		if (user) {
			console.log('Logged in successfully:', user);
			onLoginSuccess();

			navigate('/dashboard');
		} else if (error) {
			console.error('Login failed:', error);
			setLoginError(error.message);
		} else {
			console.log(user);
			// Given the successful network response, this block should not be reached.
			console.error('An unexpected issue occurred during login.');
			setLoginError('An unexpected error occurred.');
		}
	};

	// 	const { user, error } = await supabase.auth.signInWithPassword({
	// 		email: email,
	// 		password: password,
	// 	});
	// 	console.log('Login attempt:', { user, error });

	// 	if (user) {
	// 		console.log('Logged in user:', user); // Log the user object
	// 		onLoginSuccess(); // This should update the state in the parent component
	// 		navigate('/dashboard');
	// 	} else if (error) {
	// 		console.error('Login error:', error);
	// 		setLoginError(error.message);
	// 	} else {
	// 		// console.log('Login attempt:', { user, error });
	// 		// This else block should not be hit, but it's here for debugging purposes
	// 		console.error('An unexpected path was taken in the login logic.');
	// 	}
	// };

	const goBack = () => {
		navigate('/');
	};

	// TODO Downloads the icons as svg to reduce the names
	// TODO Re-create that into components
	return (
		<>
			<div className={LoginPageCSS.login_page}>
				<form
					onSubmit={handleLogin}
					className={LoginPageCSS.login_container}>
					{/* <form> */}
					<h1 className={LoginPageCSS.login_title}>Login</h1>
					<div
						className={LoginPageCSS.login_closeButton}
						onClick={goBack}>
						<box-icon
							name="arrow-back"
							color="white"
							size="lg"></box-icon>
					</div>
					<div className={LoginPageCSS.input_box}>
						<input
							id="email"
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<svg
							className="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24">
							<path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path>
						</svg>
					</div>
					<div className={LoginPageCSS.input_box}>
						<input
							id="password"
							type="password"
							placeholder="Password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<svg
							className="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24">
							<path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path>
						</svg>
					</div>
					{loginError && <span id="login-error"></span>}
					{/* <!-- Place this where you want the error message to appear --> */}
					<button
						className={LoginPageCSS.btn_login}
						type="submit">
						Login
					</button>
					{/* </form> */}
				</form>
			</div>
		</>
	);
};

export default LoginPage;
