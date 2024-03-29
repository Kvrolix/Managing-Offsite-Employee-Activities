import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigationBarCSS from './SideNavigationBar.module.css';

import supabase from '../../config/supabaseClient.js';
import logo from '../../images/MOEA_logo.png';

const SideBarLink = ({ iconClass, text }) => (
	<li className={SideNavigationBarCSS.nav_link}>
		<div
			className={SideNavigationBarCSS.btnLink}
			role="button"
			tabIndex="0">
			<i className={`${iconClass} ${SideNavigationBarCSS.icon}`}></i>
			<span className={`${SideNavigationBarCSS.text} ${SideNavigationBarCSS.nav_text}`}>{text}</span>
		</div>
	</li>
);

const SideNavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
	// TODO every <a></a> needs to be replaced with a button class
	// Icons needs to be fixed and replaced
	// TODO css will need to be updated as well
	// TODO Change every link to a component as it takes so much space
	// State to manage if the sidebar is open or closed

	// Function to toggle the sidebar state

	const navigate = useNavigate();
	const [jobroleid, setJobRoleId] = useState(null);

	// useEffect(() => {
	// 	const fetchJobRoleId = async () => {
	// 		try {
	// 			// Example query to fetch jobRoleId
	// 			const user = supabase.auth.user();
	// 			if (user) {
	// 				let { data, error } = await supabase.from('users2').select('jobroleid').eq('id', user.id).single();
	// 				// console.log(data);

	// 				if (error) throw error;
	// 				if (data) setJobRoleId(data.jobroleid);
	// 				console.log(data);
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching job role ID', error);
	// 		}
	// 	};

	// 	fetchJobRoleId();
	// }, []); // Empty dependency array means this effect runs once on mount

	async function signOutUser() {
		const { error } = await supabase.auth.signOut();
		navigate('/');
		console.log('User is logged off');
	}

	return (
		<>
			<div className={SideNavigationBarCSS.body}>
				<nav className={`${SideNavigationBarCSS.sidebar} ${isSidebarOpen ? '' : SideNavigationBarCSS.close}`}>
					<header>
						<div className={SideNavigationBarCSS.image_text}>
							<span className={SideNavigationBarCSS.image}>
								<img
									src={logo}
									alt="logo"
								/>
							</span>
							<div className={`${SideNavigationBarCSS.text} ${SideNavigationBarCSS.header_text}`}>
								<span className={SideNavigationBarCSS.fullName}>Karol Eldorado</span>
								<span className={SideNavigationBarCSS.position}>Chief</span>
							</div>
							<i
								className={`bx bx-chevron-right ${SideNavigationBarCSS.toggle}`}
								onClick={toggleSidebar}></i>
						</div>
					</header>
					<div className={SideNavigationBarCSS.menu_bar}>
						<div className={SideNavigationBarCSS.menu}>
							<ul className={SideNavigationBarCSS.menu_links}>
								<SideBarLink
									iconClass="bx bx-home-smile"
									text="Dashboard"
								/>
								<SideBarLink
									iconClass="bx bx-list-ul"
									text="Tasks"
									// visible={jobRoleId === '1'}
								/>
								<SideBarLink
									iconClass="bx bx-group"
									text="Teams"
								/>
								<SideBarLink
									iconClass="bx bx-message-dots"
									text="Chat"
								/>
								<SideBarLink
									iconClass="bx bx-file"
									text="Files"
								/>
								<SideBarLink
									iconClass="bx bx-user-check"
									text="Users"
								/>
								<SideBarLink
									iconClass="bx bx-briefcase"
									text="Organization"
								/>
							</ul>
						</div>
						<div className="bottom-content">
							<SideBarLink
								iconClass="bx bx-log-out"
								text="Logout"
								onClick={() => {
									signOutUser();
								}}
							/>
						</div>
					</div>
				</nav>
				{/* This will need to be moved to dashboard */}
				{/* <div className={SideNavigationBarCSS.home}>
					<div className={SideNavigationBarCSS.text}>Dashboard</div>
				</div> */}
			</div>
		</>
	);
};

export default SideNavigationBar;
