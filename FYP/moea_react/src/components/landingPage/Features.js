import React, { forwardRef } from 'react';

import FeaturesCSS from './Features.module.css';
const Features = forwardRef((props, ref) => {
	return (
		<>
			<section
				ref={ref}
				className={FeaturesCSS.section_features}>
				<h2 className={FeaturesCSS.features_heading}>Features</h2>
				<div className="grid-4-cols">
					<div className={FeaturesCSS.feature_container}>Element 1</div>
					<div className={FeaturesCSS.feature_container}>Element 2</div>
					<div className={FeaturesCSS.feature_container}>Element 3</div>
					<div className={FeaturesCSS.feature_container}>Element 4</div>
				</div>
			</section>
		</>
	);
});

export default Features;
