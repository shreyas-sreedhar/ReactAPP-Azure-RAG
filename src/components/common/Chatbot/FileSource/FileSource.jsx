import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './filesource.css';
import ChatUI from '../ChatUI/ChatUI';

function FileSource({ selectedFileTypes, utypename}) {
  const [selectedFileUrls, setSelectedFileUrls] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
    
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/chatbot', { fileTypes: selectedFileTypes });
      if (response.status === 200) {
        console.log("it works");
        console.log(response.data);
        // Assuming the backend sends an array of PDF file URLs
        setSelectedFileUrls(response.data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching PDF files with details:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFileTypes]);

  const handleSelectFile = (url) => {
    if (selectedFileUrls.includes(url)) {
      setSelectedFileUrls(prevSelectedFileUrls => prevSelectedFileUrls.filter(fileUrl => fileUrl !== url));
    } else {
      setSelectedFileUrls(prevSelectedFileUrls => [...prevSelectedFileUrls, url]);
    }
  };

  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };

  const handleNextClick = async () => {
    try {
      if (selectedFileUrls.length === 0) {
        console.error('No files selected');
        return;
      }
  
      const response = await axios.post('http://localhost:3001/process-selected-files', { selectedFileUrls });
      console.log("yo", response);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error while sending selected files:', error);
    }
  };

  if (isSubmitted) {
    return <ChatUI />;
  }
  return (
    <div>
      
        <div className='catalog-creation'>
          <h2>Select the files</h2>
          <p className='progress'>Step 2 of 3</p>
          <p>Select the specific file you access files from within it.</p>
          <div className='tabledeets'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>View File</th>
                  <th>Selected</th>
                </tr>
              </thead>
              <tbody>
                {selectedFileUrls.map((file, index) => ( // Change 'url' to 'file' for clarity
                  <tr key={index}>
                    <td>{file.key}</td> 
                    <td><button onClick={() => handleViewFile(file.url)}>View File</button></td> 
                    <td><input type="checkbox" checked={selectedFileUrls.includes(file.url)} onChange={() => handleSelectFile(file.url)} /></td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="next-button" onClick={handleNextClick}>Next</button>
        </div>
      
    </div>
  );
  
}
export default FileSource;
