// UserModal.js
import React, { useState, useEffect } from 'react';
import UsersPageCSS from './UsersPage.module.css';

// TODO Add some animationt to when button is oressed as there's a colorshock
// TODO Clear the fileds
// TODO Before sending the invitation email it needs to be written and then repeated to avoid errors with matching
// set their password as 123456

const AddUserModal = ({ isOpen, onClose }) => {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('');
	const [step, setStep] = useState(1);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		setLoading(true); // Start loading animation
		if (step === 1) {
			console.log('Inviting user:', { email });
			setTimeout(() => {
				setLoading(false); // Stop loading animation
				setStep(2); // Move to next step after 3 seconds
			}, 3000);
		} else {
			console.log('Saving user details:', { firstName, lastName });
			onClose(); // Close modal after all data is submitted
		}
	};

	// Reset state when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setEmail('');
			setRole('');
			setFirstName('');
			setLastName('');
			setStep(1);
			setLoading(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className={UsersPageCSS.modal_backdrop}>
			<div className={UsersPageCSS.modal_content}>
				{loading && <div className={UsersPageCSS.spinner}></div>}
				{!loading && (
					<>
						{step === 1 ? (
							<>
								<h1 className={UsersPageCSS.modal_heading}>Invite New User</h1>
								<form onSubmit={handleSubmit}>
									<div className={UsersPageCSS.input_field}>
										<label
											className={UsersPageCSS.input_label}
											htmlFor="userEmail">
											Email Address
										</label>
										<input
											type="email"
											id="userEmail"
											className={UsersPageCSS.input_text}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>

									<div className={UsersPageCSS.button_group}>
										<button
											type="submit"
											className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
											Send Invitation
										</button>
										<button
											// type="button"
											className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}
											onClick={onClose}>
											Cancel
										</button>
									</div>
								</form>
							</>
						) : (
							<>
								<h1 className={UsersPageCSS.modal_heading}>Enter User Details</h1>
								<form onSubmit={handleSubmit}>
									<div className={UsersPageCSS.input_field}>
										<label
											className={UsersPageCSS.input_label}
											htmlFor="firstName">
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											className={UsersPageCSS.input_text}
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
										/>
									</div>
									<div className={UsersPageCSS.input_field}>
										<label
											className={UsersPageCSS.input_label}
											htmlFor="lastName">
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											className={UsersPageCSS.input_text}
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
										/>
									</div>
									<div className={UsersPageCSS.input_field}>
										<label
											className={UsersPageCSS.input_label}
											htmlFor="userRole">
											User Role
										</label>
										<select
											id="userRole"
											className={UsersPageCSS.input_text}
											value={role}
											onChange={(e) => setRole(e.target.value)}>
											<option value="">Select Role</option>
											<option value="2">Manager</option>
											<option value="3">Secretary</option>
											<option value="4">Team Leader</option>
											<option value="5">Employee</option>
										</select>
									</div>
									{/* EMAIL ADDRESS */}
									{/* the email address will be taken from the sended one, but if no */}

									{/* DATE OF BIRTH */}
									{/* PHONE NUMBER */}
									{/* DATE JOINED AUTAMATICALLY */}
									{/* ORGANIZATION ID IS THE SAME AS WHO ADDS THE USER */}

									<div className={UsersPageCSS.button_group}>
										<button
											type="submit"
											className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
											Save User
										</button>
										<button
											type="button"
											className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}
											onClick={onClose}>
											Cancel
										</button>
									</div>
								</form>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};
export default AddUserModal;
