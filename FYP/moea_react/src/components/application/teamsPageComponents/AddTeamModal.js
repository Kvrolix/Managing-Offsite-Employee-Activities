import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const AddTeamModal = ({ isOpen, onClose }) => {
	const { createTeam, fetchTeamsByLeaderId, teamLeaders, fetchTeamLeaders, checkTeamLeaderAssigned, addTeamMember, fetchWorkers, workers, fetchAssignedTeamMembers } = useContext(UserDataContext);
	const [teamName, setTeamName] = useState('');
	const [teamLeaderId, setTeamLeaderId] = useState('');
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [assignedMembers, setAssignedMembers] = useState([]);

	useEffect(() => {
		if (isOpen) {
			fetchTeamLeaders();
			fetchWorkers();
			fetchAssignedTeamMembers().then(setAssignedMembers);
		}
	}, [isOpen, fetchTeamLeaders, fetchWorkers, fetchAssignedTeamMembers]);

	const handleMemberSelection = (memberId) => {
		console.log(memberId);
		setSelectedMembers((prevMembers) => (prevMembers.includes(memberId) ? prevMembers.filter((id) => id !== memberId) : [...prevMembers, memberId]));
	};

	const handleCreateTeam = async () => {
		if (!teamName || !teamLeaderId) {
			alert('Please fill in all fields');
			return;
		}

		const isAssigned = await checkTeamLeaderAssigned(teamLeaderId);
		if (isAssigned === true) {
			alert('This team leader is already assigned to another team.');
			return;
		}
		const createdTeam = await createTeam(teamName, teamLeaderId);

		const fetchedTeams = await fetchTeamsByLeaderId(teamLeaderId);
		if (fetchedTeams.success) {
			console.log('Fetched Teams:', fetchedTeams.teams);
			const teamId = fetchedTeams.teams[0].teamid;
			const teamLeaderId = fetchedTeams.teams[0].teamleaderauthid;

			const membersToAdd = selectedMembers.map((memberId) => ({
				teamid: teamId,
				userauthid: memberId,
			}));
			membersToAdd.push({ teamid: teamId, userauthid: teamLeaderId }); // Include team leader as a member

			// Add all team members at once
			const success = await addTeamMember(membersToAdd);
			if (success) {
				alert('Team and members added successfully!');
				onClose();
			} else {
				alert('Failed to add team members');
			}

			onClose();
		} else {
			alert('Team created, but failed to verify: ', fetchedTeams.error);
		}
	};

	const availableWorkers = workers.filter((worker) => !assignedMembers.includes(worker.authid));

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
					<h3 className={TeamsPageCSS.h3_heading}>Select Team Members:</h3>
					{availableWorkers.map((employee) => (
						<div
							key={employee.authid}
							className={TeamsPageCSS.employee_item}>
							<input
								type="checkbox"
								className={TeamsPageCSS.employee_list_item}
								checked={selectedMembers.includes(employee.authid)}
								onChange={() => handleMemberSelection(employee.authid)}
							/>
							{employee.firstname} {employee.surname}
						</div>
					))}
				</div>
				<div className={TeamsPageCSS.button_group}>
					<div
						className={TeamsPageCSS.modal_button_save}
						onClick={handleCreateTeam}>
						Create Team
					</div>
					<div
						className={TeamsPageCSS.modal_button_close}
						onClick={onClose}>
						Cancel
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddTeamModal;
