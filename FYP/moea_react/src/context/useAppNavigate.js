import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
	const navigate = useNavigate();

	const navigateToDashboard = () => navigate('/dashboard');
	const navigateToTasks = () => navigate('/tasks');
	const navigateToOrganization = () => navigate('/organization');
	const navigateToUsers = () => navigate('/users');
	const navigateToChat = () => navigate('/chat');
	const navigateToTeams = () => navigate('/teams');
	const navigateToMap = () => navigate('/map');
	const navigateToFiles = () => navigate('/files');

	// Add more navigation functions as needed
	const navigateToUserProfile = () => navigate('/userProfile');

	return { navigateToDashboard, navigateToTasks, navigateToOrganization, navigateToUsers, navigateToChat, navigateToTeams, navigateToMap, navigateToFiles };
};
