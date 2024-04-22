// React
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserDataProvider } from './context/UserDataContext';

// Pages
import HomePage from './pages/HomePage.js';
import LoginPage2 from './pages/LoginPage2.js';
import DashboardPage from './pages/DashboardPage.js';
import TasksPage from './pages/TasksPage.js';
import OrganizationPage from './pages/OrganizationPage.js';

function App() {
	return (
		<UserDataProvider>
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
					<Route
						path="/organization"
						element={<OrganizationPage />}
					/>
				</Routes>
			</BrowserRouter>
		</UserDataProvider>
	);
}

export default App;
