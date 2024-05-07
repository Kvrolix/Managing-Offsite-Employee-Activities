import React, { useEffect } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';

const TeamLeadersComponent = () => {
	const { teamLeaders, fetchTeamLeaders } = UserDataContext();

	useEffect(() => {
		fetchTeamLeaders();
	}, []);

	return (
		<div>
			<h1>Team Leaders</h1>
			{teamLeaders.map((leader) => (
				<div key={leader.id}>
					{leader.firstName} {leader.surname}
				</div>
			))}
		</div>
	);
};

export default TeamLeadersComponent;
