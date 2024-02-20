import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';
import FileSource from "./FileSource/FileSource";

function Chatbot({ loggedUser }) {
    const [selectedFileTypes, setSelectedFileTypes] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleFileTypeChange = (fileType) => {
        setSelectedFileTypes(prevSelectedFileTypes => {
            if (prevSelectedFileTypes.includes(fileType)) {
                return prevSelectedFileTypes.filter(type => type !== fileType);
            } else {
                return [...prevSelectedFileTypes, fileType];
            }
        });
    };

    const sendFileTypesToBackend = async () => {
        const utypename = loggedUser.userType;
    
        if (!selectedFileTypes.length || !utypename) {
            console.error('Cannot send request, missing fileTypes or utypename');
            return;
        }
    
        console.log('Sending request with:', { fileTypes: selectedFileTypes, utypename: utypename });
    
        try {
            const response = await axios.post('http://localhost:3001/chatbot', {
                fileTypes: selectedFileTypes,
                utypename: utypename,
            });
    
            console.log('Response from backend:', response.data);
            setIsSubmitted(true);
        } catch (error) {
            if (error.response) {
                console.log('Error data:', error.response.data);
                console.log('Error status:', error.response.status);
            } else if (error.request) {
                console.log('Error request:', error.request);
            } else {
                console.log('Error message:', error.message);
            }
        }
    };
    

    const handleNextClick = async () => {
        console.log('Selected file types:', selectedFileTypes);
        await sendFileTypesToBackend(); // Wait for sendFileTypesToBackend to complete
    };
    
    

    // Optional: useEffect to log utypename if you need to debug its availability
    useEffect(() => {
        console.log('Current utypename:', loggedUser.userType);
    }, [loggedUser.userType]);

    if (isSubmitted) {
        // Assuming you have a component to handle the submitted state
        return <FileSource selectedFileTypes={selectedFileTypes} utypename={loggedUser.userType} />;
    }

    const fileSources = [
        { name: 'Databases', description: 'Add AWS DB layer to discover databases related to your domain' },
        { name: 'CSVs', description: 'Add CSVs layer to discover CSVs related to your domain' },
        { name: 'PDFs', description: 'Add PDFs layer to discover PDFs related to your domain' },
        { name: 'Texts', description: 'Add Text files layer to discover documents related to your domain' },
    ];

    return (
        <div className='maincon'>
            <div className="catalog-creation">
                <h2>Hello {loggedUser.userType}, select the type of files you want to chat with!</h2>
                <p className='progress'>Step 1 of 3</p>
                <p>Select Objects to access files from within it.</p>
                <div className="file-sources">
                    {fileSources.map((source, index) => (
                        <div
                            key={index}
                            className={`file-source-card ${selectedFileTypes.includes(source.name) ? 'selected' : ''}`}
                            onClick={() => handleFileTypeChange(source.name)}
                        >
                            <h3>{source.name}</h3>
                            <p>{source.description}</p>
                        </div>
                    ))}
                </div>
                <button className="next-button" onClick={handleNextClick} disabled={buttonDisabled}>Next</button>
            </div>
        </div>
    );
}

export default Chatbot;
