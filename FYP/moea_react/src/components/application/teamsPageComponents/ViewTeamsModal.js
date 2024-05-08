import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import TeamsPageCSS from './TeamsPage.module.css';

const ViewTeamsModal = ({ isOpen, onClose }) => {
	const { fetchTeams, fetchTeamMembers, fetchUserByAuthId } = useContext(UserDataContext);
	const [teams, setTeams] = useState([]);
	const [teamMembers, setTeamMembers] = useState({});
	const [expandedTeamId, setExpandedTeamId] = useState(null);

	useEffect(() => {
		const loadTeamsAndMembers = async () => {
			const loadedTeams = await fetchTeams();
			setTeams(loadedTeams);
			const membersDetails = {};

			for (let team of loadedTeams) {
				const members = await fetchTeamMembers(team.teamid);
				const memberDetails = await Promise.all(
					members.map(async (member) => {
						const userDetails = await fetchUserByAuthId(member.userauthid);
						return { ...member, ...userDetails };
					})
				);
				membersDetails[team.teamid] = memberDetails;
			}
			setTeamMembers(membersDetails);
		};

		if (isOpen) {
			loadTeamsAndMembers();
		}
	}, [isOpen, fetchTeams, fetchTeamMembers, fetchUserByAuthId]);

	const toggleTeamDetails = (teamId) => {
		setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
	};

	if (!isOpen) return null;

	return (
		<div className={TeamsPageCSS.modal_backdrop}>
			<div className={TeamsPageCSS.modal_content}>
				<h2 className={TeamsPageCSS.modal_heading}>View Teams</h2>
				{teams.length > 0 ? (
					teams.map((team) => (
						<div
							key={team.teamid}
							className={TeamsPageCSS.team_container}>
							<h3
								onClick={() => toggleTeamDetails(team.teamid)}
								className={TeamsPageCSS.team_name}>
								{team.teamname} ({teamMembers[team.teamid]?.length || 0} Members)
							</h3>
							{expandedTeamId === team.teamid && (
								<ul className={TeamsPageCSS.team_member_list}>
									{teamMembers[team.teamid]?.map((member) => (
										<li
											key={member.userauthid}
											className={TeamsPageCSS.team_member}>
											{member.firstname} {member.surname}
											{member.userauthid === team.teamleaderauthid && <span className={TeamsPageCSS.team_leader_icon}>🌟</span>}
										</li>
									))}
								</ul>
							)}
						</div>
					))
				) : (
					<p>No teams available.</p>
				)}
				<button
					onClick={onClose}
					className={`${TeamsPageCSS.button} ${TeamsPageCSS.button_close}`}>
					Close
				</button>
			</div>
		</div>
	);
};

export default ViewTeamsModal;
