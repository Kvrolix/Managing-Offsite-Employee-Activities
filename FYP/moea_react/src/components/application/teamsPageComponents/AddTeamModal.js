import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const AddTeamModal = ({ isOpen, onClose }) => {
	const { createTeam, teamLeaders, fetchTeamLeaders, workers, fetchWorkers } = useContext(UserDataContext);
	const [teamName, setTeamName] = useState('');
	const [teamLeaderId, setTeamLeaderId] = useState('');
	const [selectedMembers, setSelectedMembers] = useState([]);

	useEffect(() => {
		fetchTeamLeaders();
		fetchWorkers();
	}, []);

	const handleAddTeam = async () => {
		if (!teamName || !teamLeaderId) {
			alert('Please fill in all fields');
			return;
		}

		const success = await createTeam(teamName, teamLeaderId);
		if (success) {
			onClose();
			alert('Team added successfully!');
		}
	};

	const handleMemberSelection = (memberId) => {
		setSelectedMembers((prevMembers) => {
			if (prevMembers.includes(memberId)) {
				return prevMembers.filter((id) => id !== memberId);
			} else {
				return [...prevMembers, memberId];
			}
		});
	};
	if (!isOpen) return null;

	return (
		<div className={TeamsPageCSS.modal_backdrop}>
			<div className={TeamsPageCSS.modal_content}>
				<h2 className={TeamsPageCSS.modal_heading}>Add New Team</h2>
				<input
					className={TeamsPageCSS.input_field}
					type="text"
					placeholder="Team Name"
					value={teamName}
					onChange={(e) => setTeamName(e.target.value)}
				/>
				<select
					className={TeamsPageCSS.input_field}
					value={teamLeaderId}
					onChange={(e) => setTeamLeaderId(e.target.value)}
					placeholder="Select Team Leader">
					<option value="">Select a team leader</option>
					{teamLeaders.map((leader) => (
						<option
							key={leader.authid}
							value={leader.authid}>
							{leader.firstname} {leader.surname}
						</option>
					))}
				</select>
				<div>
					<h3>Select Team Members:</h3>
					{workers.map((employee) => (
						<div
							key={employee.authid}
							className={TeamsPageCSS.employee_item}>
							<input
								type="checkbox"
								checked={selectedMembers.includes(employee.authid)}
								onChange={() => handleMemberSelection(employee.authid)}
							/>
							{employee.firstname} {employee.surname}
						</div>
					))}
				</div>
				<div className={TeamsPageCSS.button_group}>
					<button
						className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_primary}`}
						onClick={handleAddTeam}>
						Add Team
					</button>
					<button
						className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_secondary}`}
						onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddTeamModal;
