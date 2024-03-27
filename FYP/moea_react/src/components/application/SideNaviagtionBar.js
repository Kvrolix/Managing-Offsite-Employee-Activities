import React, { useState } from 'react';

import SideNavigationBarCSS from './SideNavigationBar.module.css';

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

const SideNavigationBar = () => {
	// TODO every <a></a> needs to be replaced with a button class
	// Icons needs to be fixed and replaced
	// TODO css will need to be updated as well
	// TODO Change every link to a component as it takes so much space
	// State to manage if the sidebar is open or closed

	// Function to toggle the sidebar state

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
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
							/>
						</div>
					</div>
				</nav>
				<section className={SideNavigationBarCSS.home}>
					<div className={SideNavigationBarCSS.text}>Dashboard</div>
				</section>
			</div>
		</>
	);
};

export default SideNavigationBar;
