// Spinner.js
import React from 'react';
import SpinnerCSS from './Spinner.css'; // Assuming you have a CSS file for styles

const Spinner = () => (
	<div className={SpinnerCSS.spinner_container}>
		<div className={SpinnerCSS.loading_spinner}></div>
	</div>
);

export default Spinner;
