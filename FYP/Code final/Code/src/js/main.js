import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

// Initialize the Supabase client
const supabase1 = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log(supabase1);

document.addEventListener('DOMContentLoaded', (event) => {
	const loginForm = document.getElementById('login-form');
	const usernameInput = document.getElementById('username');
	const passwordInput = document.getElementById('password');
	const loginError = document.getElementById('login-error'); // Add a span/div with this id for error messages

	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const email = usernameInput.value;
		const password = passwordInput.value;

		const { user, error } = await supabase.auth.signIn({ email, password });

		if (error) {
			console.error('Login error:', error.message);
			loginError.textContent = 'Login failed: ' + error.message; // Display error message
		} else if (user) {
			window.location.href = '/dashboard.html'; // Redirect to dashboard
		}
	});
});
