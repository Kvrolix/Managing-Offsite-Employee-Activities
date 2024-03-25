// Imports

import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import supabase from './config/supabaseClient.js';
// Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import LoginPage2 from './pages/LoginPage2.js';
import DashboardPage from './pages/DashboardPage.js';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<HomePage />}
				/>
				<Route
					path="/login"
					element={<LoginPage2 />}
				/>
				<Route
					path="/dashboard"
					element={<DashboardPage />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
