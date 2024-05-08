import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

// const handleMemberSelection = (memberId) => {
// 	setSelectedMembers((prevMembers) => {
// 		const newMembers = prevMembers.includes(memberId) ? prevMembers.filter((id) => id !== memberId) : [...prevMembers, memberId];
// 		console.log(`Updated members selection: ${newMembers.join(', ')}`);
// 		return newMembers;
// 	});
// };

// PLAN
// - I am creating a record in team, to create that i need to select the team leader and the name for the team, to create that record
// - # Record has been created
// - I need to find now a record that is matching the teamleader id, this value is saved from previous step
// - The record is returned with the teamID and teamLeader Id
// - Now i can create a new record in teammembers table
// - I will submit new information which is the teamleader id and a team id,

// PLAN 2:
// - Create a record in the 'team' table
// - Get a record where the column 'teamleaderauthid' is matching the selected teamleder. (As the team leader can be assigned only once)
// - With that returned record we take teamID, and a teamleaderauthid (Later when we will be selecting the people who should be in that group, we will add them with the same team id, so for each userid)
// - Now the data from the previous step will be pushed to the table 'teammembers' in the columns 'teamid' and 'userauthid

const AddTeamModal = ({ isOpen, onClose }) => {
	const { createTeam, fetchTeamsByLeaderId, teamLeaders, fetchTeamLeaders, checkTeamLeaderAssigned, addTeamMember, fetchWorkers, workers, fetchAssignedTeamMembers } = useContext(UserDataContext);
	const [teamName, setTeamName] = useState('');
	const [teamLeaderId, setTeamLeaderId] = useState('');
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [assignedMembers, setAssignedMembers] = useState([]);

	// Fetch team leaders when the component mounts
	useEffect(() => {
		if (isOpen) {
			fetchTeamLeaders();
			fetchWorkers();
			fetchAssignedTeamMembers().then(setAssignedMembers);
		}
	}, [isOpen, fetchTeamLeaders, fetchWorkers, fetchAssignedTeamMembers]);
	// console.log(workers);

	const handleMemberSelection = (memberId) => {
		console.log(memberId);
		setSelectedMembers((prevMembers) => (prevMembers.includes(memberId) ? prevMembers.filter((id) => id !== memberId) : [...prevMembers, memberId]));
	};

	const handleCreateTeam = async () => {
		if (!teamName || !teamLeaderId) {
			alert('Please fill in all fields');
			return;
		}
		// First check if the team leader is already assigned to a team
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
				onClose(); // Close the modal on success
			} else {
				alert('Failed to add team members');
			}

			onClose();
		} else {
			alert('Team created, but failed to verify: ', fetchedTeams.error);
		}
	};

	const availableWorkers = workers.filter((worker) => !assignedMembers.includes(worker.authid));
	// console.log(`Availlable workers:`, availableWorkers);

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
					{/* <button
						className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_primary}`}
						onClick={handleCreateTeam}>
						Create Team
					</button> */}

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
					{/* <button
						className={TeamsPageCSS.modal_button_close}
						onClick={onClose}>
						Cancel
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default AddTeamModal;
