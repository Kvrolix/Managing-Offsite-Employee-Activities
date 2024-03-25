import React from 'react';

import HeroCSS from './Hero.module.css';
import illustration from '../images/illustration.svg';
const Hero = () => {
	return (
		<>
			<section>
				<div className={HeroCSS.hero}>
					<div className={HeroCSS.hero_textBox}>
						<h1 className="heading__primary">Streamlining Remote Work Management</h1>
						<p className={HeroCSS.hero_text}>
							The ultimate solution to remotely manage your workforce with precision and efficiency. Our platform ensures seamless integration into your existing workflow, offering real-time updates
							and communication capabilities.
						</p>
					</div>
					<div>
						<img
							className={HeroCSS.illustration}
							src={illustration}
							alt="Person relaxing on a park bench with a laptop, enjoying a cup of coffee, with scenic mountainous landscape in the background."
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
