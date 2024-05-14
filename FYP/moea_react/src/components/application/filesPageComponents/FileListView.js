import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../../context/UserDataContext';
import FilePageCSS from './FilesPage.module.css';
import { ROLES } from '../../../context/roles';
const FileListView = () => {
	const [files, setFiles] = useState([]);
	const { userRecord, listFiles, downloadFile, deleteFile, uploadFile } = useContext(UserDataContext);

	useEffect(() => {
		fetchFiles();
	}, []);

	const fetchFiles = async () => {
		const { data, error } = await listFiles();
		if (error) {
			console.error('Failed to fetch files:', error);
		} else {
			const filteredFiles = data.filter((file) => file.name !== '.emptyFolderPlaceholder');
			setFiles(filteredFiles);
			// setFiles(data);
		}
	};

	const handleFileDownload = async (filePath) => {
		const { data, error } = await downloadFile(filePath);
		if (error) {
			console.error('Download failed:', error);
		} else {
			const url = URL.createObjectURL(data);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filePath.split('/').pop());
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
			URL.revokeObjectURL(url);
			alert('File downloaded successfully!');
		}
	};

	const handleFileDelete = async (filePath) => {
		const { error } = await deleteFile(filePath);
		if (error) {
			console.error('Deletion failed:', error);
		} else {
			console.log('File deleted:', filePath);
			alert('File deleted successfully!');
			setFiles(files.filter((file) => file.name !== filePath)); // Update the list after deletion
		}
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const { path, error } = await uploadFile(file);
		if (error) {
			console.error('Upload failed:', error);
		} else {
			console.log('File uploaded to:', path);
			alert('File uploaded successfully!');
			setFiles([...files, { name: file.name }]); // Add the new file to the list
		}
	};

	return (
		<div>
			{[ROLES.CHIEF, ROLES.MANAGER, ROLES.SECRETARY].includes(userRecord.jobroleid) && (
				<>
					<h2 className={FilePageCSS.h2_heading}>Upload Document</h2>
					<div onChange={handleFileUpload}>
						<input
							type="file"
							onChange={handleFileUpload}></input>
					</div>
				</>
			)}
			<h2 className={FilePageCSS.h2_heading}>Organization Files</h2>
			{files.map((file) => (
				<div
					key={file.name}
					className={FilePageCSS.file}>
					<span className={FilePageCSS.file_name}>{file.name}</span>
					<div
						onClick={() => handleFileDownload(file.name)}
						className={`${FilePageCSS.file_button} ${FilePageCSS.file_button__download}`}>
						Download
					</div>
					{[ROLES.CHIEF, ROLES.MANAGER, ROLES.SECRETARY].includes(userRecord.jobroleid) && (
						<>
							<div
								onClick={() => handleFileDelete(file.name)}
								className={`${FilePageCSS.file_button} ${FilePageCSS.file_button__delete}`}>
								Delete
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default FileListView;
