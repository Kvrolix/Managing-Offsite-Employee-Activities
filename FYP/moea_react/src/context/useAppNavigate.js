import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
	const navigate = useNavigate();

	const navigateToDashboard = () => navigate('/dashboard');
	const navigateToTasks = () => navigate('/tasks');
	const navigateToOrganization = () => navigate('/organization');
	const navigateToUsers = () => navigate('/users');
	const navigateToUserProfile = () => navigate('/profile');
	const navigateToTeams = () => navigate('/teams');
	const navigateToMap = () => navigate('/map');
	const navigateToFiles = () => navigate('/files');

	// Add more navigation functions as needed

	return { navigateToDashboard, navigateToTasks, navigateToOrganization, navigateToUsers, navigateToTeams, navigateToMap, navigateToFiles, navigateToUserProfile };
};
