import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const EditTeamsModal = ({ isOpen, onClose }) => {
	const { fetchTeams, updateTeamName, fetchTeamMembers, fetchAvailableWorkers, addTeamMember, fetchUserByAuthId, removeTeamMember } = useContext(UserDataContext);

	const [teams, setTeams] = useState([]);
	const [selectedTeamId, setSelectedTeamId] = useState(null);
	const [teamDetails, setTeamDetails] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [availableWorkers, setAvailableWorkers] = useState([]);
	const [selectedWorkers, setSelectedWorkers] = useState([]);
	const [isRemoveMemberVisible, setIsRemoveMemberVisible] = useState(false);

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

	const handleRemoveMember = async (teamId, userAuthId) => {
		const success = await removeTeamMember(teamId, userAuthId);
		if (success) {
			alert('Member removed successfully!');
			// Update local state to reflect the change
			setTeamDetails((prev) => ({
				...prev,
				[teamId]: {
					...prev[teamId],
					members: prev[teamId].members.filter((member) => member.userauthid !== userAuthId),
				},
			}));
		} else {
			alert('Failed to remove member.');
		}
	};

	if (!isOpen) return null;

	return (
		<div className={TeamsPageCSS.modal_backdrop}>
			<div className={TeamsPageCSS.modal_content}>
				<h2 className={TeamsPageCSS.modal_heading}>Edit Teams</h2>
				<div className={TeamsPageCSS.team_list}>
					{teams.map((team) => (
						<div
							key={team.teamid}
							className={TeamsPageCSS.team_item}>
							{/* TODO This can be a div not a button */}
							<div
								className={TeamsPageCSS.modal_team_item}
								onClick={() => handleSelectTeam(team.teamid)}>
								{team.teamname}
							</div>
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
									<h3 className={TeamsPageCSS.h3_heading}>
										Selected Team:<span className={TeamsPageCSS.modal_team_selected}>{teamDetails[selectedTeamId]?.teamname}</span>
									</h3>

									<div
										className={TeamsPageCSS.modal_settings_button}
										onClick={() => setEditMode(true)}>
										Edit Name
									</div>
								</>
							)}
						</div>
						<div>
							<h3 className={TeamsPageCSS.h3_heading}>Team Members</h3>
							<ul className={TeamsPageCSS.modal_list}>
								{teamDetails[selectedTeamId]?.members.map((member) => (
									<li
										key={member.userauthid}
										className={TeamsPageCSS.modal_list_item}>
										{member.firstname} {member.surname}
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className={TeamsPageCSS.h3_heading}>Add New Members</h3>
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
							<div
								className={`${TeamsPageCSS.modal_settings_button} ${TeamsPageCSS.modal_settings_button_members}`}
								onClick={() => handleAddMembers(selectedTeamId)}>
								Add Selected Members
							</div>
							<div>
								<h3 className={TeamsPageCSS.h3_heading}>Remove a member</h3>
								<ul className={TeamsPageCSS.modal_list}>
									{teamDetails[selectedTeamId]?.members.map((member) => (
										<li
											key={member.userauthid}
											className={TeamsPageCSS.modal_list_item}>
											<div className={TeamsPageCSS.modal_list_item_flex}>
												{member.firstname} {member.surname}
												<div
													className={TeamsPageCSS.modal_button_remove}
													onClick={() => handleRemoveMember(selectedTeamId, member.userauthid)}>
													Remove
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}
				<div
					onClick={onClose}
					className={TeamsPageCSS.modal_button_close}>
					Close
				</div>
			</div>
		</div>
	);
};

export default EditTeamsModal;
