// console.log('Dashboard Page');

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

import SideNavigationBar from '../components/application/SideNaviagtionBar';

const DashboardPage = () => {
	const [user, setUser] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		async function getUserData() {
			await supabase.auth.getUser().then((value) => {
				//  value.data.user
				if (value.data?.user) {
					console.log(value.data.user);
					setUser(value.data.user);
				}
			});
		}
		getUserData();
	}, []);

	async function signOutUser() {
		const { error } = await supabase.auth.signOut();
		navigate('/');
		console.log('User is logged off');
	}
	console.log(user);
	return (
		<div>
			<SideNavigationBar />
			{/* <h1>Dasboard Sucess</h1>
			<h2>Helo{user.email}</h2>
			<h3>Role:{user.role}</h3>
			<h3>Id:{user.id}</h3>
			<h3>{}</h3>
			<button
				onClick={() => {
					signOutUser();
				}}>
				Log out
			</button> */}
		</div>
	);
};

export default DashboardPage;
