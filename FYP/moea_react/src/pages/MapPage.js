import React, { useState, useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import MarkerClusterGroup from 'react-leaflet-cluster';
import '../../node_modules/leaflet/dist/leaflet.css';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import MapPageCSS from '../components/application/mapPageComponents/MapPage.module.css';

import L, { Icon } from 'leaflet';
import { UserDataContext } from '../context/UserDataContext';
import { formatDateTime, getPositionName } from '../context/helpers';

const MapPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [locations, setLocations] = useState([]);
	const { allEmployees, fetchUserLocations } = useContext(UserDataContext);
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

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
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
