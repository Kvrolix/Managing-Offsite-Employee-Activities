import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';

import supabase from '../../../config/supabaseClient.js';
import UsersPageCSS from './UsersPage.module.css';
// TODO Add some animationt to when button is oressed as there's a colorshock
// TODO Clear the fileds
// TODO Before sending the invitation email it needs to be written and then repeated to avoid errors with matching
// set their password as 123456
// remove any additional symbols like whitespaces

// Questions
// 1. What is the use for htmlFor

const AddUserModal = ({ isOpen, onClose }) => {
	const { userRecord } = useContext(UserDataContext);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [confirmEmail, setConfirmEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [role, setRole] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const handleInviteUser = async () => {
		if (email !== confirmEmail) {
			alert('Emails do not match!');
			return;
		}

		try {
			setLoading(true);
			const { user, error } = await supabase.auth.signUp({
				email: email,
				password: '123456', // Default password for the new user
			});

			if (error) throw error;
			console.log('User created with UID:', user.id);
			setStep(2); // Move to step 2 to enter further details
		} catch (error) {
			// BUG
			alert('Error sending invitation: ', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveUserDetails = async () => {
		try {
			setLoading(true);
			// Fetch the user UID based on email address
			// BUG with users
			const { data, error: fetchError } = await supabase.from('auth.users').select('id').eq('email', email).single();

			if (fetchError) throw fetchError;

			const { data: createData, error: createError } = await supabase.from('users2').insert([
				{
					authid: data.id,
					firstname: firstName,
					lastname: lastName,
					jobroleid: role,
					dob: dateOfBirth,
					phone: phoneNumber,
					email: email,
					organizationid: userRecord.organizationid,
				},
			]);

			if (createError) throw createError;

			console.log('User record created:', createData);
			alert('User successfully created!');
			onClose(); // Close modal after success
		} catch (error) {
			alert('Error creating user record: ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (step === 1) {
			handleInviteUser();
		} else {
			handleSaveUserDetails();
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setEmail('');
			setConfirmEmail('');
			setFirstName('');
			setLastName('');
			setRole('');
			setDateOfBirth('');
			setPhoneNumber('');
			setStep(1);
			setLoading(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<>
			<div className={UsersPageCSS.modal_backdrop}>
				<div className={UsersPageCSS.modal_content}>
					{loading && <div className={UsersPageCSS.spinner}></div>}
					{!loading && (
						<>
							<h1 className={UsersPageCSS.modal_heading}>{step === 1 ? 'Invite New User' : 'Enter User Details'}</h1>
							<form onSubmit={handleSubmit}>
								{step === 1 ? (
									<>
										<div className={UsersPageCSS.input_field}>
											<label
												htmlFor="userEmail"
												className={UsersPageCSS.input_label}>
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
										<div className={UsersPageCSS.input_field}>
											<label
												htmlFor="confirmEmail"
												className={UsersPageCSS.input_label}>
												Confirm Email Address
											</label>
											<input
												type="email"
												id="confirmEmail"
												className={UsersPageCSS.input_text}
												value={confirmEmail}
												onChange={(e) => setConfirmEmail(e.target.value)}
												required
											/>
										</div>
									</>
								) : (
									<>
										<div className={UsersPageCSS.input_field}>
											<label
												htmlFor="firstName"
												className={UsersPageCSS.input_label}>
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
												htmlFor="lastName"
												className={UsersPageCSS.input_label}>
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
												htmlFor="dateOfBirth"
												className={UsersPageCSS.input_label}>
												Date of Birth
											</label>
											<input
												type="date"
												id="dateOfBirth"
												className={UsersPageCSS.input_text}
												value={dateOfBirth}
												onChange={(e) => setDateOfBirth(e.target.value)}
												required
											/>
										</div>
										<div className={UsersPageCSS.input_field}>
											<label
												htmlFor="phoneNumber"
												className={UsersPageCSS.input_label}>
												Phone Number
											</label>
											<input
												type="text"
												id="phoneNumber"
												className={UsersPageCSS.input_text}
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
											/>
										</div>
									</>
								)}
								<div className={UsersPageCSS.button_group}>
									<button
										type="submit"
										className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
										{step === 1 ? 'Send Invitation' : 'Save User'}
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
				</div>
			</div>
		</>
	);
};

// const AddUserModal = ({ isOpen, onClose }) => {
// 	//
// 	const { userRecord } = useContext(UserDataContext);
// 	// Add User Modal
// 	const [step, setStep] = useState(1);
// 	const [loading, setLoading] = useState(false);
// 	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

// 	// User Data Creation
// 	const [confirmEmail, setConfirmEmail] = useState('');
// 	const [email, setEmail] = useState('');
// 	const [firstName, setFirstName] = useState('');
// 	const [lastName, setLastName] = useState('');
// 	const [role, setRole] = useState('');
// 	const [dateOfBirth, setDateOfBirth] = useState('');
// 	const [phoneNumber, setPhoneNumber] = useState('');

// 	const inviteUser = async () => {
// 		if (email !== confirmEmail) {
// 			alert('Emails do not match!');
// 			setLoading(false);
// 			return;
// 		}

// 		try {
// 			const { user, error } = await supabase.auth.signUp({
// 				email: email,
// 				password: '123456', // Default password
// 			});

// 			if (error) throw error;

// 			if (user) {
// 				console.log('User created with UID:', user.id);
// 				setStep(2); // Proceed to next step to enter further details
// 			}
// 		} catch (error) {
// 			alert('Error sending invitation: ' + error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const saveUserDetails = async () => {
// 		// Fetch the user UID based on email
// 		const { data: userData, error: userError } = await supabase.from('auth.users').select('id').eq('email', email).single();

// 		if (userError) {
// 			alert('Error fetching user data: ' + userError.message);
// 			setLoading(false);
// 			return;
// 		}

// 		try {
// 			const { data, error } = await supabase.from('users2').insert([
// 				{
// 					authid: userData.id,
// 					email: email,
// 					firstname: firstName,
// 					lastname: lastName,
// 					jobroleid: role,
// 					dob: dateOfBirth,
// 					phone: phoneNumber,
// 					// TODO add organization
// 				},
// 			]);

// 			if (error) throw error;

// 			console.log('User record created:', data);
// 			setShowSuccessMessage(true);
// 			setTimeout(() => {
// 				setShowSuccessMessage(false);
// 				onClose(); // Close modal after success message
// 			}, 3000);
// 		} catch (error) {
// 			alert('Error creating user record: ' + error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleSubmit = (event) => {
// 		event.preventDefault();
// 		setLoading(true);

// 		if (step === 1) {
// 			inviteUser();
// 		} else {
// 			saveUserDetails();
// 		}
// 	};

// 	// Reset state when modal is closed
// 	useEffect(() => {
// 		if (!isOpen) {
// 			setEmail('');
// 			setConfirmEmail('');
// 			setRole('');
// 			setFirstName('');
// 			setLastName('');
// 			setStep(1);
// 			setLoading(false);
// 		}
// 	}, [isOpen]);

// 	if (!isOpen) return null;

// 	return (
// 		<>
// 			{showSuccessMessage && <div className={UsersPageCSS.success_message}>User created successfully!</div>}

// 			<div className={UsersPageCSS.modal_backdrop}>
// 				<div className={UsersPageCSS.modal_content}>
// 					{loading && <div className={UsersPageCSS.spinner}></div>}
// 					{!loading && (
// 						<>
// 							{step === 1 ? (
// 								<>
// 									<h1 className={UsersPageCSS.modal_heading}>Invite New User</h1>
// 									<form onSubmit={handleSubmit}>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="userEmail">
// 												Email Address
// 											</label>
// 											<input
// 												type="email"
// 												id="userEmail"
// 												className={UsersPageCSS.input_text}
// 												value={email}
// 												onChange={(e) => setEmail(e.target.value)}
// 												required
// 											/>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="confirmEmail">
// 												Confirm Email Address
// 											</label>
// 											<input
// 												type="email"
// 												id="confirmEmail"
// 												className={UsersPageCSS.input_text}
// 												value={confirmEmail}
// 												onChange={(e) => setConfirmEmail(e.target.value)}
// 												required
// 											/>
// 										</div>

// 										<div className={UsersPageCSS.button_group}>
// 											<button
// 												type="submit"
// 												className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
// 												Send Invitation
// 											</button>
// 											<button
// 												className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}
// 												onClick={onClose}>
// 												Cancel
// 											</button>
// 										</div>
// 									</form>
// 								</>
// 							) : (
// 								<>
// 									<h1 className={UsersPageCSS.modal_heading}>Enter User Details</h1>
// 									<form onSubmit={handleSubmit}>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="userRole">
// 												User Role
// 											</label>
// 											<select
// 												id="userRole"
// 												className={UsersPageCSS.input_text}
// 												value={role}
// 												onChange={(e) => setRole(e.target.value)}>
// 												<option value="">Select Role</option>
// 												<option value="2">Manager</option>
// 												<option value="3">Secretary</option>
// 												<option value="4">Team Leader</option>
// 												<option value="5">Employee</option>
// 											</select>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="firstName">
// 												First Name
// 											</label>
// 											<input
// 												type="text"
// 												id="firstName"
// 												className={UsersPageCSS.input_text}
// 												value={firstName}
// 												onChange={(e) => setFirstName(e.target.value)}
// 												required
// 											/>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="lastName">
// 												Last Name
// 											</label>
// 											<input
// 												type="text"
// 												id="lastName"
// 												className={UsersPageCSS.input_text}
// 												value={lastName}
// 												onChange={(e) => setLastName(e.target.value)}
// 												required
// 											/>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="dateOfBirth">
// 												Date of Birth
// 											</label>
// 											<input
// 												type="date"
// 												id="dateOfBirth"
// 												className={UsersPageCSS.input_text}
// 												value={dateOfBirth}
// 												onChange={(e) => setDateOfBirth(e.target.value)}
// 												required
// 											/>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label className={UsersPageCSS.input_label}>Email Address</label>
// 											<input
// 												type="email"
// 												className={UsersPageCSS.input_text}
// 												value={email}
// 												readOnly
// 											/>
// 										</div>
// 										<div className={UsersPageCSS.input_field}>
// 											<label
// 												className={UsersPageCSS.input_label}
// 												htmlFor="phoneNumber">
// 												Phone Number
// 											</label>
// 											<input
// 												className={UsersPageCSS.input_text}
// 												value={phoneNumber}
// 												onChange={(e) => setPhoneNumber(e.target.value)}></input>
// 										</div>

// 										{/* DATE JOINED AUTAMATICALLY */}
// 										{/* ORGANIZATION ID IS THE SAME AS WHO ADDS THE USER */}

// 										<div className={UsersPageCSS.button_group}>
// 											<button
// 												type="submit"
// 												className={`${UsersPageCSS.button} ${UsersPageCSS.button_primary}`}>
// 												Save User
// 											</button>
// 											<button
// 												type="button"
// 												className={`${UsersPageCSS.button} ${UsersPageCSS.button_secondary}`}
// 												onClick={onClose}>
// 												Cancel
// 											</button>
// 										</div>
// 									</form>
// 								</>
// 							)}
// 						</>
// 					)}
// 				</div>
// 			</div>
// 		</>
// 	);
// };
export default AddUserModal;
