// ViewUsersModal.js
import React, { useState, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext'; // Adjust path as necessary
import UsersPageCSS from './UsersPage.module.css'; // Ensure your CSS path is correct
import { formatDateTime } from '../../../context/helpers';

const ViewUsersModal = ({ isOpen, onClose }) => {
	const { allEmployees } = useContext(UserDataContext);
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

	const toggleEmployeeDetails = (id) => {
		setSelectedEmployeeId(selectedEmployeeId === id ? null : id);
	};

	if (!isOpen) return null;

	return (
		<div className={UsersPageCSS.modal_backdrop}>
			<div className={UsersPageCSS.modal_content}>
				<div className={UsersPageCSS.users_list_container}>
					<h2 className={UsersPageCSS.modal_heading}>View Users</h2>
					{allEmployees.map((employee) => (
						<div
							key={employee.authid}
							className={UsersPageCSS.employee_item}>
							<div
								onClick={() => toggleEmployeeDetails(employee.authid)}
								className={UsersPageCSS.employee_name}>
								{employee.firstname} {employee.surname}
							</div>
							{selectedEmployeeId === employee.authid && (
								<div className={UsersPageCSS.employee_details}>
									<p>
										<span className={UsersPageCSS.employee_column}>Email:</span> {employee.emailaddress}
									</p>
									<p>
										<span className={UsersPageCSS.employee_column}>Phone Number:</span> {employee.phonenumber}
									</p>
									<p>
										<span className={UsersPageCSS.employee_column}>Date Joined:</span> {formatDateTime(employee.datejoined)}
									</p>
									<p>
										<span className={UsersPageCSS.employee_column}>JobRole:</span> {employee.jobroleid}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
				<button
					onClick={onClose}
					className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}>
					Close
				</button>
			</div>
		</div>
	);
};

export default ViewUsersModal;
