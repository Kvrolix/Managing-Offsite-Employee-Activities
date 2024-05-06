import React, { useState, useContext, useEffect } from 'react';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import ChatPageCSS from '../components/application/chatPageComponents/ChatPage.module.css';
import { UserDataContext } from '../context/UserDataContext';

const ChatPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [activeSessionId, setActiveSessionId] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [activeContact, setActiveContact] = useState(null);
	const { allEmployees, sendMessage, fetchMessages } = useContext(UserDataContext);

	useEffect(() => {
		const loadContacts = async () => {
			const employees = await allEmployees;
			setContacts(employees);
		};
		loadContacts();
	}, []); // Dependency array is empty to ensure this runs only once when the component mounts
	useEffect(() => {
		if (activeContact) {
			fetchMessages(activeContact.authid).then(setMessages);
		}
	}, [activeContact, fetchMessages]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleSendMessage = async () => {
		if (message.trim() && activeContact) {
			const msg = {
				senderId: 'yourUserId', // Should be dynamically set based on the logged-in user
				receiverId: activeContact.authid,
				text: message,
				timestamp: new Date().toISOString(),
			};
			const sentMessage = await sendMessage(msg);
			if (sentMessage) {
				setMessages([...messages, msg]);
				setMessage('');
			}
		}
	};

	// Fetch messages when the session changes
	useEffect(() => {
		const loadMessages = async () => {
			if (activeSessionId) {
				const loadedMessages = await fetchMessages(activeSessionId);
				setMessages(loadedMessages);
			}
		};
		loadMessages();
	}, [activeSessionId, fetchMessages]);

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
								key={contact.authid} // Make sure to use a unique key
								className={ChatPageCSS.contact_item}
								onClick={() => setActiveSessionId(contact.sessionId)}>
								<div className={ChatPageCSS.contact_details}>
									<span className={`${ChatPageCSS.contact_status} ${contact.status === 'online' ? ChatPageCSS.status_online : ChatPageCSS.status_offline}`}></span>
									<div className={ChatPageCSS.contact_text}>
										{contact.firstname} {contact.surname}
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
