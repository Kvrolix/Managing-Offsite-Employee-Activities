import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// CSS
import HeaderCSS from './Header.module.css';

// Images
import logo from '../../images/MOEA_logo.png';

const Header = ({ scrollToFeatures }) => {
	const navigate = useNavigate();

	const handleLoginClick = () => {
		navigate('/login');
	};

	return (
		<>
			<header className={HeaderCSS.header}>
				<Link
					to="/"
					className="logo-link">
					<img
						src={logo}
						alt="Logo of the company MOEA"
						className={HeaderCSS.logo}
					/>
				</Link>
				<nav className={HeaderCSS.main_nav}>
					<ul className={HeaderCSS.main_nav_list}>
						{/* <li>
							<button className={HeaderCSS.btn_link}>About</button>
						</li>
						<li>
							<button
								className={HeaderCSS.btn_link}
								onClick={scrollToFeatures}>
								Features
							</button>
						</li>
						<li>
							<button className={HeaderCSS.btn_link}>Product</button>
						</li>
						<li>
							<button className={HeaderCSS.btn_link}>Reviews</button>
						</li> */}
					</ul>
				</nav>
				<div className={`${HeaderCSS.main_nav_btns}`}>
					<button
						className={`btn ${HeaderCSS.btn_nav_login}`}
						onClick={handleLoginClick}>
						Log in
					</button>
					{/* <button className={`btn ${HeaderCSS.btn_nav_register}`}>Join Us</button> */}
				</div>
			</header>
		</>
	);
};

export default Header;
