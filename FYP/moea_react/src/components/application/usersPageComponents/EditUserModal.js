import React, { useState, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import UsersPageCSS from './UsersPage.module.css';

const EditUserModal = ({ isOpen, onClose, user }) => {
	const { updateEmployeeDetails } = useContext(UserDataContext);
	const [formData, setFormData] = useState({
		firstname: user ? user.firstname : '',
		lastname: user ? user.lastname : '',
		phone: user ? user.phone : '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await updateEmployeeDetails(user.authid, formData);
		onClose(); // Close the modal upon successful update
	};

	if (!isOpen) return null;

	return (
		<div className={UsersPageCSS.modal_backdrop}>
			<div className="modalContent">
				<h2>Edit User</h2>
				<form onSubmit={handleSubmit}>
					<label>
						First Name:
						<input
							type="text"
							name="firstname"
							value={formData.firstname}
							onChange={handleChange}
						/>
					</label>
					<label>
						Last Name:
						<input
							type="text"
							name="lastname"
							value={formData.lastname}
							onChange={handleChange}
						/>
					</label>
					<label>
						Phone Number:
						<input
							type="text"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
						/>
					</label>
					<button type="submit">Save Changes</button>
					<button
						type="button"
						onClick={onClose}>
						Cancel
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditUserModal;
