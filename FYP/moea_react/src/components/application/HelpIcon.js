import React, { useState } from 'react';

const HelpIcon = ({ helpContent }) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className="help_container">
			<button
				className="help_button"
				onClick={toggleVisibility}>
				?
			</button>
			{isVisible && (
				<div className="help_popup">
					<div className="help_content">
						<button
							className="close_button"
							onClick={toggleVisibility}></button>
						{helpContent}
					</div>
				</div>
			)}
		</div>
	);
};

export default HelpIcon;
