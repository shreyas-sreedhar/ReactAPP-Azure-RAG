import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../chatbot.css';

function FileOptions({ selectedDomains, loggedUser }) {
    const [domainData, setDomainData] = useState([]);
    const [s3Data, setS3Data] = useState(null);
    const [showS3Data, setShowS3Data] = useState(false);
    const [showTables, setShowTables] = useState(false);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const constructS3Url = () => {
            const bucketName = "shreyaswapi"; // Adjust if necessary
            const region = "us-east-2"; // Your S3 bucket region
            const fileKey = `selectedDomainsData/${loggedUser}.json`;
            return `https://shreyaswapi.s3.us-east-2.amazonaws.com/selectedDomainsData/Brand+Manager.json`;
        };

        const fetchDomainData = async () => {
            const fileUrl = constructS3Url(loggedUser, selectedDomains); // Now passing arguments

            try {
                const response = await axios.get(fileUrl);
                setDomainData(Array.isArray(response.data) ? response.data : [response.data]); // Ensure domainData is always an array
            } catch (error) {
                console.error('Error fetching selected domain data from S3:', error);
            }
        };

        if (selectedDomains && loggedUser) { // Ensure there are selected domains and a logged user before fetching
            fetchDomainData();
        }
    }, [selectedDomains, loggedUser]); // Depend on selectedDomains and loggedUser to refetch when they change


    // const fetchDbDetails = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:3000/api/database-details');
    //         setDbDetails(response.data); // Assuming the backend sends data in the correct format
    //         setShowDbDetails(true); // Show the details upon successful fetch
    //     } catch (error) {
    //         console.error('Error fetching database details:', error);
    //         setShowDbDetails(false);
    //     }
    // };
    const fetchS3Data = async () => {
        const s3Url = "https://shreyaswapi.s3.us-east-2.amazonaws.com/dump/idk.yml";
        try {
            const response = await axios.get(s3Url);
            console.log(response.data);
            // setS3Data(response.data);
            setTables(response.data.tables); // Assuming the response structure matches your YAML converted to JSON
            setShowTables(true);
     // Set the fetched data to state
        } catch (error) {
            console.error('Error fetching data from S3:', error);
        }
    };
    useEffect(() => {
        fetchS3Data();
    }, []);

    // Replace 'yourS3UrlHere' with the actual S3 URL you want to fetch from
    

    return (
        <div>
            <h3>Domain Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>File Name</th>
                        <th>File Path</th>
                    </tr>
                </thead>
                <tbody>
                    {domainData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.domain}</td>
                            <td>{item.file_name}</td>
                            <td><a href={`https://shreyaswapi.s3.us-east-2.amazonaws.com/${item.file_path}`} target="_blank" rel="noreferrer">Download</a></td>
                            

                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
        

            <div>
            <div>
            <button onClick={fetchS3Data}>Show Tables</button>
            {showTables && tables.map((table, index) => (
                <div key={index}>
                    <h2>{table.name}</h2>
                    <p>{table.description}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Column Name</th>
                                <th>Description</th>
                                <th>Data Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.columns.map((column, colIndex) => (
                                <tr key={colIndex}>
                                    <td>{column.name}</td>
                                    <td>{column.description}</td>
                                    {/* Highlight varchar data types in uppercase */}
                                    <td style={{ textTransform: column.data_type === 'varchar' ? 'uppercase' : 'none' }}>
                                        {column.data_type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
        </div>
        </div>

        </div>
    );
}

export default FileOptions;
