import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const EditTeamsModal = ({ isOpen, onClose }) => {
	const { fetchTeams, updateTeamName, fetchTeamMembers, fetchAvailableWorkers, addTeamMember, fetchUserByAuthId } = useContext(UserDataContext);

	const [teams, setTeams] = useState([]);
	const [selectedTeamId, setSelectedTeamId] = useState(null);
	const [teamDetails, setTeamDetails] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [availableWorkers, setAvailableWorkers] = useState([]);
	const [selectedWorkers, setSelectedWorkers] = useState([]);

	useEffect(() => {
		if (isOpen) {
			fetchTeams().then((teams) => {
				setTeams(teams);
				teams.forEach((team) => {
					fetchTeamMembers(team.teamid).then((members) => {
						const detailedMembers = Promise.all(
							members.map(async (member) => {
								const userDetails = await fetchUserByAuthId(member.userauthid);
								return { ...member, ...userDetails };
							})
						);
						detailedMembers.then((detailedMembers) => {
							setTeamDetails((prev) => ({ ...prev, [team.teamid]: { ...team, members: detailedMembers } }));
						});
					});
				});
				fetchAvailableWorkers().then(setAvailableWorkers);
			});
		}
	}, [isOpen, fetchTeams, fetchTeamMembers, fetchAvailableWorkers]);

	const handleSelectTeam = (teamId) => {
		setSelectedTeamId(teamId);
		setEditMode(false);
	};

	const handleTeamNameChange = (e, teamId) => {
		setTeamDetails((prev) => ({
			...prev,
			[teamId]: { ...prev[teamId], teamname: e.target.value },
		}));
	};

	const handleUpdateTeamName = async (teamId) => {
		const { teamname } = teamDetails[teamId];
		const success = await updateTeamName(teamId, teamname);
		if (success) {
			alert('Team name updated successfully!');
			setEditMode(false);
		} else {
			alert('Failed to update team name.');
		}
	};

	const handleWorkerSelection = (workerId) => {
		setSelectedWorkers((prev) => (prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]));
	};

	const handleAddMembers = async () => {
		if (selectedWorkers.length > 0) {
			// Preparing data for database insertion
			const membersToAdd = selectedWorkers.map((workerId) => ({
				teamid: selectedTeamId,
				userauthid: workerId,
			}));

			// Log the data that will be sent to the database
			console.log('Preparing to add team members:', membersToAdd);

			// Attempt to add team members
			const success = await addTeamMember(membersToAdd);
			if (success) {
				alert('Members added successfully!');
				onClose(); // Refresh or close modal
			} else {
				alert('Failed to add members.');
			}
		} else {
			alert('No members selected for addition.');
		}
	};

	if (!isOpen) return null;

	return (
		<div className={TeamsPageCSS.modal_backdrop}>
			<div className={TeamsPageCSS.modal_content}>
				<h2>Edit Teams</h2>
				<div className={TeamsPageCSS.team_list}>
					{teams.map((team) => (
						<div
							key={team.teamid}
							className={TeamsPageCSS.team_item}>
							<button onClick={() => handleSelectTeam(team.teamid)}>{team.teamname}</button>
						</div>
					))}
				</div>
				{selectedTeamId && (
					<div className={TeamsPageCSS.team_details}>
						<div>
							{editMode ? (
								<>
									<input
										type="text"
										value={teamDetails[selectedTeamId]?.teamname || ''}
										onChange={(e) => handleTeamNameChange(e, selectedTeamId)}
									/>
									<button onClick={() => handleUpdateTeamName(selectedTeamId)}>Save</button>
									<button onClick={() => setEditMode(false)}>Cancel</button>
								</>
							) : (
								<>
									<h3>{teamDetails[selectedTeamId]?.teamname}</h3>
									<button onClick={() => setEditMode(true)}>Edit Name</button>
								</>
							)}
						</div>
						<div>
							<h4>Team Members:</h4>
							<ul>
								{teamDetails[selectedTeamId]?.members.map((member) => (
									<li key={member.userauthid}>
										{member.firstname} {member.surname}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h4>Add New Members:</h4>
							{availableWorkers.map((worker) => (
								<div
									key={worker.authid}
									className={TeamsPageCSS.worker_item}>
									<input
										type="checkbox"
										checked={selectedWorkers.includes(worker.authid)}
										onChange={() => handleWorkerSelection(worker.authid)}
									/>
									{worker.firstname} {worker.surname}
								</div>
							))}
							<button onClick={() => handleAddMembers(selectedTeamId)}>Add Selected Members</button>
						</div>
					</div>
				)}
				<button
					onClick={onClose}
					className={TeamsPageCSS.close_button}>
					Close
				</button>
			</div>
		</div>
	);
};

export default EditTeamsModal;
