// Data
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/SideNaviagtionBar.js';
import OrganizationPageCSS from '../components/application/organizationPageComponents/OrganizationPage.module.css';
import React, { useState, useContext, useEffect } from 'react';

const OrganizationPage = () => {
	const { allEmployees, fetchJobRoleNameById } = useContext(UserDataContext);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [employees, setEmployees] = useState([]);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderEmployeesByRole = (role) => {
		return allEmployees
			.filter((employee) => employee.jobroleid === role)
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
			));
	};

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
				<h1 className={OrganizationPageCSS.organization_heading}>Organization</h1>

				<div>
					<h2>Chief</h2>
					{renderEmployeesByRole(1)}
					{/* Chiefs */}
				</div>
				<div>
					<h3>Managers</h3>
					{renderEmployeesByRole(2)}
					{/* Managers */}
				</div>
				<h3>Secretaries</h3>
				<div>
					{renderEmployeesByRole(3)}
					{/* Secretaries */}
				</div>
				<h3>Team Leaders</h3>
				<div>
					{renderEmployeesByRole(4)}
					{/* Team Leaders */}
				</div>
				<h4>Employees</h4>
				<div>
					{renderEmployeesByRole(5)}
					{/* Employees */}
				</div>
			</div>
		</>
	);
};

export default OrganizationPage;
