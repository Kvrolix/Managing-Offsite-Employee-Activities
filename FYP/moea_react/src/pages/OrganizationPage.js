// Data
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import OrganizationPageCSS from '../components/application/organizationPageComponents/OrganizationPage.module.css';
import React, { useState, useContext, useEffect } from 'react';

// TODO I want to see the actual organization name on the top "Essa Organization "

const OrganizationPage = () => {
	const { allEmployees, fetchJobRoleNameById } = useContext(UserDataContext);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [employees, setEmployees] = useState([]);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderEmployeesByRole = (role, roleName) => (
		<div>
			<h2 className={OrganizationPageCSS.position_title}>{roleName}</h2>
			<div className={OrganizationPageCSS.role_container}>
				{allEmployees
					.filter((e) => e.jobroleid === role)
					.map((employee) => (
						<div
							key={employee.authid}
							className={OrganizationPageCSS.employee_card}>
							<p>
								{employee.firstname} {employee.surname}
							</p>
							<p>{employee.email}</p>
							<p>{employee.phonenumber}</p>
							<p>{getPositionName(employee.jobroleid)}</p>
						</div>
					))}
			</div>
		</div>
	);

	const getPositionName = (jobrole) => {
		switch (jobrole) {
			case 1:
				return 'Chief';
			case 2:
				return 'Manager';
			case 3:
				return 'Secretary';
			case 4:
				return 'Team Leader';
			case 5:
				return 'Employee';
			default:
				return 'Unknown';
		}
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={OrganizationPageCSS.container_organization}>
				<div className={OrganizationPageCSS.container_organization}>
					<h1 className={OrganizationPageCSS.organization_heading}>Organization</h1>

					{renderEmployeesByRole(1, 'Chief')}
					{renderEmployeesByRole(2, 'Managers')}
					{renderEmployeesByRole(3, 'Secretaries')}
					{renderEmployeesByRole(4, 'Team Leaders')}
					{renderEmployeesByRole(5, 'Employees')}
				</div>
			</div>
		</>
	);
};

export default OrganizationPage;
