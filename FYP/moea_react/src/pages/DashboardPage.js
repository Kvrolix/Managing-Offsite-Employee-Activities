// console.log('Dashboard Page');

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

import TestingUserContext from './TestingUserContext.js';
import { UserDataProvider } from '../context/UserDataContext'; // Adjust the path to your UserDataContext file
// Styles
import SideNavigationBar from '../components/application/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/DashboardOptions.js';
import SideNavigationBarCSS from '../components/application/SideNavigationBar.module.css';

const DashboardPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	//  Function to toggle sidebar state
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// const [user, setUser] = useState({});
	// const navigate = useNavigate();
	//

	// // TODO from here all the data will be shared to other places?
	// useEffect(() => {
	// 	async function getUserData() {
	// 		await supabase.auth.getUser().then((value) => {
	// 			//  value.data.user
	// 			if (value.data?.user) {
	// 				console.log(value.data.user);
	// 				setUser(value.data.user);
	// 			}
	// 		});
	// 	}
	// 	getUserData();
	// }, []);
	// const [fetchError, setFetchError] = useState(null);
	// const [users, setUsers] = useState('');

	// useEffect(() => {
	// 	const fetchUsers = async () => {
	// 		const { data, error } = await supabase.from('users2').select();
	// 		if (error) {
	// 			setFetchError('Could not fetch users');
	// 			setUsers(null);
	// 		}
	// 		console.log(error);
	// 		if (data) {
	// 			console.log(data);
	// 			setUsers(data);
	// 			setFetchError(null);
	// 		}
	// 	};
	// 	fetchUsers();
	// }, []);

	return (
		<>
			<UserDataProvider>
				<SideNavigationBar
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={toggleSidebar}
				/>
				<DashboardOptions isSidebarOpen={isSidebarOpen} />
				<TestingUserContext />
			</UserDataProvider>
		</>
	);
};

export default DashboardPage;
