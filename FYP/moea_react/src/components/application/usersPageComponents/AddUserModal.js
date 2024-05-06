import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import supabase from '../../../config/supabaseClient.js';
import UsersPageCSS from './UsersPage.module.css';

const AddUserModal = ({ isOpen, onClose }) => {
	const { userRecord } = useContext(UserDataContext);

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [confirmEmail, setConfirmEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [role, setRole] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	// FIXME TODO
	//BUG THE PROBLEM, IS RELATED TO THE SUPABASE, AS IT REQUIRES THE FOLLOWING FIELDS
	// SOLUTION CREATE A NEW FIELD AS A PRIMARY KEY
	// TEMP DISABLE
	// const handleSaveUserDetails = async () => {
	// 	if (email !== confirmEmail) {
	// 		alert('Emails do not match!');
	// 		return;
	// 	}

	// 	try {
	// 		setLoading(true);
	// 		const { data, error } = await supabase.from('users2').insert([
	// 			{
	// 				firstname: firstName,
	// 				surname: lastName,
	// 				jobroleid: parseInt(role),
	// 				dateofbirth: dateOfBirth,
	// 				phonenumber: parseInt(phoneNumber),
	// 				emailaddress: email,
	// 				organizationid: userRecord.organizationid,
	// 			},
	// 		]);

	// 		if (error) throw error;
	// 		alert('User successfully created!');
	// 		onClose(); // Close modal after success
	// 	} catch (error) {
	// 		alert('Error creating user record: ', error.message);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const handleSubmit = (event) => {
		event.preventDefault();
		// handleSaveUserDetails();
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

			setLoading(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className={UsersPageCSS.modal_backdrop}>
			<div className={UsersPageCSS.modal_content}>
				{loading && <div className={UsersPageCSS.spinner}></div>}
				{!loading && (
					<form onSubmit={handleSubmit}>
						<h1 className={UsersPageCSS.modal_heading}>Enter User Details</h1>
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
								htmlFor="email"
								className={UsersPageCSS.input_label}>
								Email Address
							</label>
							<input
								type="email"
								id="email"
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
								type="number"
								id="phoneNumber"
								className={UsersPageCSS.input_text}
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</div>
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
				)}
			</div>
		</div>
	);
};

export default AddUserModal;
