// import { supabase } from '../config/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';

import supabase from '../config/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const LoginPage2 = () => {
	const navigate = useNavigate();

	supabase.auth.onAuthStateChange(async (event) => {
		if (event === 'SIGNED_IN') {
			// forward to dashboard
			navigate('/dashboard');
		}
		if (event === 'SIGNED_OUT') {
			navigate('/');
		}
	});
	return (
		<>
			{/* Later on make sure you adjust the login page */}
			<div className="login_page_container">
				<Auth
					supabaseClient={supabase}
					theme="dark"
					appearance={{ theme: ThemeSupa }}
					providers={[]}
				/>
			</div>
		</>
	);
};

export default LoginPage2;
