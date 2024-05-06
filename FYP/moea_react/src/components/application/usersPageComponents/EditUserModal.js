import React, { useState, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import UsersPageCSS from './UsersPage.module.css';

const EditUserModal = ({ isOpen, onClose, users }) => {
	const { updateEmployeeDetails } = useContext(UserDataContext);
	const [selectedUser, setSelectedUser] = useState(null);
	const [formData, setFormData] = useState({ firstname: '', lastname: '', phone: '', email: '', jobrole: '' });

	const selectUser = (user) => {
		setSelectedUser(user);
		setFormData({
			firstname: user.firstname,
			lastname: user.surname,
			phone: user.phonenumber,
			email: user.emailaddress,
			jobrole: user.jobroleid,
		});
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await updateEmployeeDetails(selectedUser.authid, formData);
		onClose(); // Close the modal upon successful update
	};

	if (!isOpen) return null;

	return (
		<div className={UsersPageCSS.modal_backdrop}>
			<div className={UsersPageCSS.modal_content}>
				<h2 className={UsersPageCSS.modal_heading}>Edit User</h2>
				{selectedUser ? (
					<form onSubmit={handleSubmit}>
						<div className={UsersPageCSS.input_field}>
							<label className={UsersPageCSS.input_label}>First Name</label>
							<input
								type="text"
								name="firstname"
								className={UsersPageCSS.input_text}
								value={formData.firstname}
								onChange={handleChange}
								required
							/>
						</div>
						<div className={UsersPageCSS.input_field}>
							<label className={UsersPageCSS.input_label}>Last Name</label>
							<input
								type="text"
								name="lastname"
								className={UsersPageCSS.input_text}
								value={formData.lastname}
								onChange={handleChange}
								required
							/>
						</div>
						<div className={UsersPageCSS.input_field}>
							<label className={UsersPageCSS.input_label}>Phone Number</label>
							<input
								type="text"
								name="phone"
								className={UsersPageCSS.input_text}
								value={formData.phone}
								onChange={handleChange}
								required
							/>
						</div>
						<div className={UsersPageCSS.input_field}>
							<label className={UsersPageCSS.input_label}>Email</label>
							<input
								type="email"
								name="email"
								className={UsersPageCSS.input_text}
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className={UsersPageCSS.input_field}>
							<label className={UsersPageCSS.input_label}>Postition</label>
							<input
								type="text"
								name="jobrole"
								className={UsersPageCSS.input_text}
								value={formData.jobrole}
								onChange={handleChange}
								required
							/>
						</div>
						<div className={UsersPageCSS.button_group}>
							<button
								type="submit"
								className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
								Save Changes
							</button>
							<button
								type="button"
								className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}
								onClick={() => setSelectedUser(null)}>
								Back to List
							</button>
						</div>
					</form>
				) : (
					<div className={UsersPageCSS.users_list_container}>
						{users.map((user) => (
							<div
								key={user.authid}
								className={UsersPageCSS.employee_item}
								onClick={() => selectUser(user)}>
								<span className={UsersPageCSS.employee_name}>
									{user.firstname} {user.surname}
								</span>
							</div>
						))}
					</div>
				)}
				<button
					type="button"
					className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary} ${UsersPageCSS.margin_top_2rem}`}
					onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default EditUserModal;
