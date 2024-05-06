import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
	const navigate = useNavigate();

	const navigateToDashboard = () => navigate('/dashboard');
	const navigateToTasks = () => navigate('/tasks');
	const navigateToOrganization = () => navigate('/organization');
	const navigateToUsers = () => navigate('/users');
	const navigateToChat = () => {
		navigate('/chat');
	};
	// Add more navigation functions as needed

	const navigateToTeams = () => {};
	const navigateToFiles = () => {};
	// const navigateToOrganization = () => {};

	return { navigateToDashboard, navigateToTasks, navigateToOrganization, navigateToUsers, navigateToChat };
};
