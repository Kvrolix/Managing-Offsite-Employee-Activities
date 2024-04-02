// React
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage.js';
import LoginPage2 from './pages/LoginPage2.js';
import DashboardPage from './pages/DashboardPage.js';
import TasksPage from './pages/TasksPage.js';

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
				<Route
					path="/tasks"
					element={<TasksPage />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
