// console.log('Dashboard Page');

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

import SideNavigationBar from '../components/application/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/DashboardOptions.js';
import SideNavigationBarCSS from '../components/application/SideNavigationBar.module.css';
const DashboardPage = () => {
	const [user, setUser] = useState({});
	const navigate = useNavigate();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Function to toggle sidebar state
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// TODO from here all the data will be shared to other places?
	useEffect(() => {
		async function getUserData() {
			await supabase.auth.getUser().then((value) => {
				//  value.data.user
				if (value.data?.user) {
					console.log(value.data.user);
					setUser(value.data.user);
				}
			});
		}
		getUserData();
	}, []);

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			<DashboardOptions isSidebarOpen={isSidebarOpen} />

			{/* Map */}
			{/* Calendar */}
		</>
	);
};

export default DashboardPage;
