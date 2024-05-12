// Data
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import OrganizationPageCSS from '../components/application/organizationPageComponents/OrganizationPage.module.css';
import React, { useState, useContext, useEffect } from 'react';

// TODO
import HelpIcon from '../components/application/HelpIcon.js';

const OrganizationPage = () => {
	const { userRecord, allEmployees, fetchOrganizationName } = useContext(UserDataContext);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [organizationName, setOrganizationName] = useState('');

	const userOrganizationId = userRecord.organizationid;
	// const getOrganizationName = fetchJobRoleNameById(userOrganizationId);

	const helpContent = 'All of the personnel in the organisation, together with their personal phone numbers and positions within the company, are listed on this page of the organisation. ';

	useEffect(() => {
		const getOrganizationName = async () => {
			if (userRecord && userRecord.organizationid) {
				try {
					const fetchedOrganizationName = await fetchOrganizationName(userRecord.organizationid);
					setOrganizationName(fetchedOrganizationName);
				} catch (error) {
					console.error('Failed to fetch organization name:', error);
				}
			}
		};

		getOrganizationName();
	}, [userRecord, fetchOrganizationName]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderEmployeesByRole = (role, roleName) => (
		<div className={OrganizationPageCSS.position_container}>
			<h2 className={OrganizationPageCSS.position_title}>{roleName}</h2>
			{allEmployees
				.filter((e) => e.jobroleid === role)
				.map((employee) => (
					<div
						key={employee.authid}
						className={OrganizationPageCSS.employee_card}>
						<p className={OrganizationPageCSS.employee_name}>
							{employee.firstname} {employee.surname}
						</p>
						{/* <p>{employee.emailaddress}</p>
						<p>{employee.phonenumber}</p> */}
						{/* <p>{getPositionName(employee.jobroleid)}</p> */}
					</div>
				))}
		</div>
	);

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={helpContent} />
			<div className={OrganizationPageCSS.container_organization}>
				<h1 className={OrganizationPageCSS.organization_heading}>{`${organizationName.toUpperCase()} ORGANIZATION`} </h1>
				{renderEmployeesByRole(1, 'Chief')}
				{renderEmployeesByRole(2, 'Managers')}
				{renderEmployeesByRole(3, 'Secretaries')}
				{renderEmployeesByRole(4, 'Team Leaders')}
				{renderEmployeesByRole(5, 'Employees')}
			</div>
		</>
	);
};

export default OrganizationPage;
