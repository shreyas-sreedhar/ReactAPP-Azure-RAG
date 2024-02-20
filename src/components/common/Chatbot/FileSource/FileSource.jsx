import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './filesource.css';
import ChatUI from '../ChatUI/ChatUI';

function FileSource({ selectedFileTypes, utypename }) {
  const [files, setFiles] = useState([]); // Now this will store the full file objects
  const [selectedFiles, setSelectedFiles] = useState(new Set()); // To keep track of selected files
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/chatbot', {
        fileTypes: selectedFileTypes,
        utypename: utypename,
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log("Files fetched successfully:", response.data);
        setFiles(response.data); // Store the full file objects received from backend
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFileTypes, utypename]); // Refetch when these props change

  const handleSelectFile = (file) => {
    setSelectedFiles(prevSelectedFiles => {
      const newSelectedFiles = new Set(prevSelectedFiles);
      if (newSelectedFiles.has(file)) {
        newSelectedFiles.delete(file);
      } else {
        newSelectedFiles.add(file);
      }
      return newSelectedFiles;
    });
  };

  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };

  const handleNextClick = async () => {
    if (selectedFiles.size === 0) {
      console.error('No files selected');
      return;
    }

    // Map the selected files Set to an array of URLs to send to the backend
    const selectedFileUrls = Array.from(selectedFiles).map(file => file.fileURL);
    try {
      const response = await axios.post('http://localhost:3001/process-selected-files', { selectedFileUrls });
      console.log("Response after submitting selected files:", response);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error while sending selected files:', error);
    }
  };

  if (isSubmitted) {
    return <ChatUI />;
  }

  return (
    <div className='catalog-creation'>
      <h2>Welcome to your File Catalog.</h2>
      <p className='progress'>Step 2 of 3</p>
      <p>Select the specific file from your catalog to add it to your chatbot.</p>
      <div className='tabledeets'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>View File</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{file.fileName}</td>
                <td>
                  <button className="view-file-button" onClick={() => handleViewFile(file.fileURL)}>
                    View File
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file)}
                    onChange={() => handleSelectFile(file)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
          <button className="next-button" onClick={handleNextClick}>Next</button>
        </div>
      
  );
  
}
export default FileSource;
