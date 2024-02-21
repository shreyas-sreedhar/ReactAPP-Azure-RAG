import React, { useState } from 'react';
import axios from 'axios';
import '../chatbot.css';
import FileOptions from "../FileOption/FileOptions";

function Catsel({ loggedUser }) {
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [showFileOptions, setShowFileOptions] = useState(false);
    console.log(loggedUser)
    const uType = loggedUser.userType;
    const handleDomainSelection = (domainName) => {
        setSelectedDomains(prevSelectedDomains => {
            if (prevSelectedDomains.includes(domainName)) {
                return prevSelectedDomains.filter(name => name !== domainName);
            } else {
                return [...prevSelectedDomains, domainName];
            }
        });
    };

    const handleNextClick = async () => {
        try {
            console.log("user"+uType);
            console.log(selectedDomains)
            // Send selected domain names to the backend
            // const selectedDomainsArray = selectedDomains.split(',');
            
            await axios.post('http://localhost:3001/selected-domains', { selectedDomains, uType});
            console.log(selectedDomains);
            console.log("user"+uType);
            // Once the request is successful, set showFileOptions to true to display the next step
            setShowFileOptions(true);
        } catch (error) {
            console.error('Error sending selected domain names to the backend:', error);
        }
    };

    const handleFileOptionsClose = () => {
        setShowFileOptions(false);
    };

    if (showFileOptions) {
        return <FileOptions selectedDomains={selectedDomains} loggedUser={loggedUser} />
    }

    const domainNames = [
        { name: 'Sales', description: 'Add Sales data to your catalog' },
        { name: 'Product', description: 'Add Product data to your catalog' },
        { name: 'Marketing', description: 'Add Marketing data to your catalog' },
        { name: 'Business', description: 'Add Business data to your catalog' },
    ];

    return (
        <div className='maincon'>
            <div className="catalog-selection">
                <h2>Hello {loggedUser.userType}, select the domains you're interested in!</h2>
                <p className='progress'>Step 1 of 3</p>
                <p>Select domains to access files related to them.</p>
                <div className="catalog-names">
                    {domainNames.map((domain, index) => (
                        <div
                            key={index}
                            className={`file-source-card ${selectedDomains.includes(domain.name) ? 'selected' : ''}`}
                            onClick={() => handleDomainSelection(domain.name)}
                        >
                            <h3>{domain.name}</h3>
                            <p>{domain.description}</p>
                        </div>
                    ))}
                </div>
                <button className="next-button" onClick={handleNextClick}>Next</button>
            </div>
        </div>
    );
}

export default Catsel;
