// React
import React, { useState, useContext, useEffect } from 'react';

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';
// import MarkerClusterGroup from 'react-leaflet-cluster';

// CSS
import MapPageCSS from '../components/application/mapPageComponents/MapPage.module.css';

// Componenets
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import HelpIcon from '../components/application/HelpIcon';

// Data
import { UserDataContext } from '../context/UserDataContext';
import { formatDateTime, getPositionName } from '../context/helpers';

const MapPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [locations, setLocations] = useState([]);
	const { allEmployees, fetchUserLocations, userRecord } = useContext(UserDataContext);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	useEffect(() => {
		const loadAndEnrichLocations = async () => {
			const enrichedLocations = await enrichUserLocationsWithData(allEmployees);
			setLocations(enrichedLocations);
		};
		loadAndEnrichLocations();
	}, [allEmployees]); // Re-fetch when allEmployees changes

	const enrichUserLocationsWithData = async (allEmployees) => {
		const userIDs = allEmployees.map((emp) => emp.authid);
		const locations = await fetchUserLocations(userIDs);
		console.log(`UserIDS:`, userIDs);

		// Combining location data with employee data from allEmployees
		const enrichedLocations = locations.map((location) => {
			const employeeDetails = allEmployees.find((emp) => emp.authid === location.userauthid);
			return {
				...location,
				firstname: employeeDetails ? employeeDetails.firstname : 'Unknown',
				surname: employeeDetails ? employeeDetails.surname : 'Unknown',
				jobroleid: employeeDetails ? employeeDetails.jobroleid : 'Unknown',
			};
		});
		console.log(`Enriched Locations:`, enrichedLocations);
		return enrichedLocations;
	};

	locations.map((location) => console.log(`my location:`, location.latitude));

	const getMarkerIcon = (jobRoleId) => {
		let className = '';
		let emoji = '';

		switch (jobRoleId) {
			case 1:
				className = 'marker_chief';
				emoji = '🟥';
				break;
			case 2:
				className = 'marker_manager';
				emoji = '🟧';
				break;
			case 3:
				className = 'marker_secretary';
				emoji = '🟨';
				break;
			case 4:
				className = 'marker_teamLeader';
				emoji = '🟦';
				break;
			case 5:
				className = 'marker_worker';
				emoji = '🟩';
				break;
			default:
				className = 'marker_default';
				emoji = '❔';
		}

		return new L.DivIcon({
			html: `<div class="${className}" style="font-size: 24px;">${emoji}</div>`,
			iconSize: [30, 34],
			iconAnchor: [15, 34],
			className: '',
		});
	};
	const getHelpContentBasedOnRole = (jobRole) => {
		const colourDefinition = () => {
			return (
				<>
					<h3 className="help_header">Colours definition</h3>
					<ul className="help_list">
						<li>🟥 Chief</li>
						<li>🟧 Manager</li>
						<li>🟨 Secretary</li>
						<li>🟦 Team Leader</li>
						<li>🟩 Worker</li>
					</ul>{' '}
				</>
			);
		};

		switch (jobRole) {
			case 1: // Chief
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p> You have access to view all employees on the map. You can monitor locations and manage the overall workforce distribution to ensure optimal operational efficiency.</p>
						{colourDefinition()}
					</div>
				);

			case 2: // Manager
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p> You can view the locations of the employees under your supervision on the map. This allows you to coordinate and manage your team's activities effectively.</p>
						{colourDefinition()}
					</div>
				);

			case 3: // Secretary
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p>You have the ability to view specific employee locations on the map as required for scheduling and organizational tasks.</p>
						<h3 className="help_header">Colours definition</h3>
						{colourDefinition()}
					</div>
				);

			case 4: // Team Leader
				return 'Access Denied: Team Leaders do not have access to view the map component. Please contact your Manager for necessary information.';
			case 5: // Worker
				return 'Access Denied: Workers do not have access to view the map component. Please refer to your direct supervisor for any location-based inquiries.';
			default: // Undefined
				return 'Access Denied: Your role does not have access to the map component. Please contact your administrator if you believe this is an error.';
		}
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={getHelpContentBasedOnRole(userRecord.jobroleid)} />
			<div className={MapPageCSS.page_container}>
				<h1 className={MapPageCSS.page_heading}>Locate the Users</h1>
				<div
					style={{ height: '800px', width: '100%' }}
					className={MapPageCSS.map_container}>
					<MapContainer
						center={[51.505, -0.09]}
						zoom={10}
						scrollWheelZoom={true}
						style={{ height: '100%', width: '100%' }}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						{locations.map((location) => (
							<Marker
								position={[location.latitude, location.longitude]}
								icon={getMarkerIcon(location.jobroleid)}>
								<Popup>
									<div className={MapPageCSS.popup}>
										<h1 className={MapPageCSS.popup_name}>
											{location.firstname} {location.surname}
										</h1>
										<h2 className={MapPageCSS.popup_role}>{getPositionName(location.jobroleid)}</h2>

										<h2>
											Last Seen: <span className={MapPageCSS.popup_date}>{formatDateTime(location.recordeddatetime)}</span>
										</h2>
									</div>
								</Popup>
							</Marker>
						))}
					</MapContainer>
				</div>
			</div>
		</>
	);
};

export default MapPage;
