import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const EditTeamsModal = ({ isOpen, onClose }) => {
	const { fetchTeams, updateTeamName, fetchAvailableWorkers, addTeamMember, removeTeamMember } = useContext(UserDataContext);

	const [teams, setTeams] = useState([]);
	const [selectedTeamId, setSelectedTeamId] = useState(null);
	const [teamName, setTeamName] = useState('');
	const [availableWorkers, setAvailableWorkers] = useState([]);
	const [selectedWorkers, setSelectedWorkers] = useState([]);

	useEffect(() => {
		if (isOpen) {
			fetchTeams().then(setTeams);
			fetchAvailableWorkers().then(setAvailableWorkers);
		}
	}, [isOpen, fetchTeams, fetchAvailableWorkers]);

	const handleSelectTeam = async (team) => {
		setSelectedTeamId(team.teamid);
		setTeamName(team.teamname);
	};

	const handleTeamNameChange = async (e) => {
		setTeamName(e.target.value);
	};

	const handleUpdateTeamName = async () => {
		const success = await updateTeamName(selectedTeamId, teamName);
		if (success) {
			alert('Team name updated successfully!');
		} else {
			alert('Failed to update team name.');
		}
	};
	const handleWorkerSelection = (workerId) => {
		console.log('Current selected workers before update:', selectedWorkers);
		setSelectedWorkers((prev) => {
			const newSelectedWorkers = prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId];
			console.log('New selected workers after update:', newSelectedWorkers);
			return newSelectedWorkers;
		});
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
				<ul>
					{teams.map((team) => (
						<li key={team.teamid}>
							<button onClick={() => handleSelectTeam(team)}>{team.teamname}</button>
						</li>
					))}
				</ul>
				{selectedTeamId && (
					<>
						<input
							type="text"
							value={teamName}
							onChange={handleTeamNameChange}
							onBlur={handleUpdateTeamName}
						/>
						<h3>Add New Members:</h3>
						{availableWorkers.map((worker) => (
							<div
								key={worker.authid}
								className={TeamsPageCSS.employee_item}>
								<input
									type="checkbox"
									checked={selectedWorkers.includes(worker.authid)}
									onChange={() => handleWorkerSelection(worker.authid)}
								/>
								{worker.firstname} {worker.surname}
							</div>
						))}
						<div>
							<h3>Available Workers:</h3>
							{availableWorkers.map((worker) => (
								<div key={worker.authid}>
									{worker.firstname} {worker.lastname}
								</div>
							))}
						</div>
						<button
							className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_primary}`}
							onClick={handleAddMembers}>
							Add Selected Members
						</button>
						<button
							className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_secondary}`}
							onClick={onClose}>
							Close
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default EditTeamsModal;
