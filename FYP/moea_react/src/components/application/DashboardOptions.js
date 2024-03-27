import React from 'react';
import DashboardOptionsCSS from './DashboardOptions.module.css';
import SideNavigationBarCSS from './SideNavigationBar.module.css';
const DashboardElement = ({ icon, text }) => (
	<div className="dashboard-element">
		<div className="dashboard-icon">
			<span className="material-icons md-36">{icon}</span>
		</div>
		<p>{text}</p>
	</div>
);
const DashboardOptions = () => {
	return (
		<>
			{/* this will be the home class */}
			<div className="container">
				{/* <div className={SideNavigationBarCSS.home}> */}
				<div className="dashboard-container">
					<div className="grid dashboard-grid">
						<div className="grid dashboard-goto border-radius-10px box-shadow-light">
							<DashboardElement
								icon="assignment"
								text="Tasks"
							/>
							<DashboardElement
								icon="supervised_user_circle"
								text="Teams"
							/>
							<DashboardElement
								icon="question_answer"
								text="Chat"
							/>
							<DashboardElement
								icon="description"
								text="Files"
							/>
							<DashboardElement
								icon="group"
								text="Users"
							/>
							<DashboardElement
								icon="hub"
								text="Organization"
							/>
						</div>
						<div className="dashboard-map border-radius-10px box-shadow-light"></div>
						<div className="dashboard-calendar border-radius-10px box-shadow-light"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardOptions;
