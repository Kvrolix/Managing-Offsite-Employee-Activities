import React, { useRef } from 'react';
import Hero from '../components/landingPage/Hero.js';
import Features from '../components/landingPage/Features.js';
import Header from '../components/landingPage/Header.js';

const HomePage = () => {
	const aboutRef = useRef(null); //TODO
	const featuresRef = useRef(null);
	const productRef = useRef(null); //TODO
	const reviewsRef = useRef(null); //TODO

	const scrollToFeatures = () => {
		// Scroll to the features current position
		// It has to be an american version be careful
		featuresRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<Header scrollToFeatures={scrollToFeatures} />
			<Hero />
			<Features ref={featuresRef} />
			<div>
				<section>
					<div className="white-box"></div>
				</section>
				<section>
					<div className="white-box"></div>
				</section>
			</div>
		</>
	);
};

export default HomePage;
