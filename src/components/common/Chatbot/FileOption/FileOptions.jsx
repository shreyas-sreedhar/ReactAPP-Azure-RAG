import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../chatbot.css';


function FileOptions({ selectedDomains, loggedUser }) {
    const [domainData, setDomainData] = useState([]);
    const [tables, setTables] = useState([]);
    const [showTables, setShowTables] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indication
    const [error, setError] = useState(''); // New state for error messages

    useEffect(() => {
        const constructS3Url = () => {
            const bucketName = "shreyaswapi";
            const region = "us-east-2";
            const fileKey = `selectedDomainsData/${loggedUser}.json`;
            return `https://shreyaswapi.s3.us-east-2.amazonaws.com/selectedDomainsData/Brand+Manager.json`;
        };

        const fetchDomainData = async () => {
            setIsLoading(true); // Indicate loading state
            try {
                const fileUrl = constructS3Url(loggedUser, selectedDomains);
                const response = await axios.get(fileUrl);
                setDomainData(Array.isArray(response.data) ? response.data : [response.data]);
            } catch (error) {
                console.error('Error fetching selected domain data from S3:', error);
                setError('Failed to fetch domain data'); // Set error message
            } finally {
                setIsLoading(false); // Reset loading state
            }
        };

        if (selectedDomains && loggedUser) {
            fetchDomainData();
        }
    }, [selectedDomains, loggedUser]);

    const fetchS3Data = async () => {
        console.log(loggedUser)
        if(loggedUser.userType === "Brand Manager" || loggedUser.userType === "VP Sales"){

        const s3Url = "http://localhost:3001/database-details";

        try {
            const response = await axios.post(s3Url);
            setTables(response.data); // Assuming this is the correct path
            setShowTables(true);
        } catch (error) {
            console.error('Error fetching data from S3:', error);
        }
    }
        else {
            alert("You dont have credentials to display DB data");
        }
    };
    const viewcolm = async () => {

    }

    return (
        <div>
            {isLoading && <p>Loading...</p>} {/* Loading indication */}
            {error && <p>{error}</p>} {/* Error message */}

            <h3>Domain Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>File Name</th>
                        <th>File Path</th>
                        <th>Choose File</th>
                    </tr>
                </thead>
                <tbody>
                    {domainData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.domain}</td>
                            <td>{item.file_name}</td>
                            <td><a href={`https://shreyaswapi.s3.us-east-2.amazonaws.com/${item.file_path}`} target="_blank" rel="noreferrer">Download</a></td>
                            <td><button className='next-button4'>Add to bucket</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={fetchS3Data}>Fetch Dabatase Details</button>
            {/* <div>
                
                {showTables && tables.map((table, index) => (
                    <div key={index}>
                        <h2></h2>
                        <p></p>
                        <h5>Columns:</h5>
                   
                    </div>

                ))} */}
                <h3>Database Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>Database Name</th>
                        <th>Database Description</th>
                        <th> Columns</th>
                        <th>Choose File</th>
                    </tr>
                </thead>
                <tbody>
                {showTables && tables.map((table, index) => (
                        <tr key={index}>
                            <td>{table.name}</td>
                            <td>{table.description}</td>
                            <td> <button className='next-button5' onClick={viewcolm}>View Columns</button></td>
                            <td><button className='next-button4'>Add to bucket</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>  
        // </div>
    );
}

export default FileOptions;
