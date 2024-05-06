import React, { useState } from 'react';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import ChatPageCSS from '../components/application/chatPageComponents/ChatPage.module.css';

const ChatPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	const contacts = [
		{ id: 1, firstname: 'John', lastname: 'Doe', status: 'online' },
		{ id: 2, firstname: 'Jane', lastname: 'Doe', status: 'offline' },
		{ id: 3, firstname: 'Alice', lastname: 'Johnson', status: 'online' },
		// Add more contacts as needed
	];

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleSendMessage = () => {
		if (message.trim()) {
			setMessages([...messages, message]);
			setMessage('');
		}
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={ChatPageCSS.page_container}>
				<div className={ChatPageCSS.chat_container}>
					<div className={ChatPageCSS.chat_sidebar}>
						{contacts.map((contact) => (
							<div
								key={contact.id}
								className={ChatPageCSS.contact_item}>
								<div className={ChatPageCSS.contact_details}>
									<span className={`${ChatPageCSS.contact_status} ${contact.status === 'online' ? ChatPageCSS.status_online : ChatPageCSS.status_offline}`}></span>
									<div className={ChatPageCSS.contact_text}>
										{contact.firstname} {contact.lastname}
									</div>
								</div>
							</div>
						))}
					</div>
					<div className={ChatPageCSS.chat_main}>
						<div className={ChatPageCSS.messages_display}>
							{messages.map((msg, index) => (
								<div key={index}>{msg}</div>
							))}
						</div>
						<div className={ChatPageCSS.message_input_container}>
							<input
								type="text"
								className={ChatPageCSS.input_message}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Type a message..."
							/>
							<button
								className={ChatPageCSS.send_button}
								onClick={handleSendMessage}>
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChatPage;
