// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './chatbot.css';
// import FileSource from "./FileSource/FileSource";

// function Chatbot({ loggedUser }) {
//     const [selectedFileTypes, setSelectedFileTypes] = useState([]);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [buttonDisabled, setButtonDisabled] = useState(false);

//     const handleFileTypeChange = (fileType) => {
//         setSelectedFileTypes(prevSelectedFileTypes => {
//             if (prevSelectedFileTypes.includes(fileType)) {
//                 return prevSelectedFileTypes.filter(type => type !== fileType);
//             } else {
//                 return [...prevSelectedFileTypes, fileType];
//             }
//         });
//     };

//     const sendFileTypesToBackend = async () => {
//         const utypename = loggedUser.userType;

//         if (!selectedFileTypes.length || !utypename) {
//             console.error('Cannot send request, missing fileTypes or utypename');
//             return;
//         }

//         console.log('Sending request with:', { fileTypes: selectedFileTypes, utypename: utypename });

//         try {
//             const response = await axios.post('http://localhost:3001/chatbot', {
//                 fileTypes: selectedFileTypes,
//                 utypename: utypename,
//             });

//             console.log('Response from backend:', response.data);
//             setIsSubmitted(true);
//         } catch (error) {
//             if (error.response) {
//                 console.log('Error data:', error.response.data);
//                 console.log('Error status:', error.response.status);
//             } else if (error.request) {
//                 console.log('Error request:', error.request);
//             } else {
//                 console.log('Error message:', error.message);
//             }
//         }
//     };


//     const handleNextClick = async () => {
//         console.log('Selected file types:', selectedFileTypes);
//         await sendFileTypesToBackend(); // Wait for sendFileTypesToBackend to complete
//     };



//     // Optional: useEffect to log utypename if you need to debug its availability
//     useEffect(() => {
//         console.log('Current utypename:', loggedUser.userType);
//     }, [loggedUser.userType]);

//     if (isSubmitted) {
//         // Assuming you have a component to handle the submitted state
//         return <FileSource selectedFileTypes={selectedFileTypes} utypename={loggedUser.userType} />;
//     }

//     const fileSources = [
//         { name: 'Databases', description: 'Add AWS DB layer to discover databases related to your domain' },
//         { name: 'CSVs', description: 'Add CSVs layer to discover CSVs related to your domain' },
//         { name: 'PDFs', description: 'Add PDFs layer to discover PDFs related to your domain' },
//         { name: 'Texts', description: 'Add Text files layer to discover documents related to your domain' },
//     ];

//     return (
//         <div className='maincon'>
//             <div className="catalog-creation">
//                 <h2>Hello {loggedUser.userType}, select the type of files you want to chat with!</h2>
//                 <p className='progress'>Step 1 of 3</p>
//                 <p>Select Objects to access files from within it.</p>
//                 <div className="file-sources">
//                     {fileSources.map((source, index) => (
//                         <div
//                             key={index}
//                             className={`file-source-card ${selectedFileTypes.includes(source.name) ? 'selected' : ''}`}
//                             onClick={() => handleFileTypeChange(source.name)}
//                         >
//                             <h3>{source.name}</h3>
//                             <p>{source.description}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <button className="next-button" onClick={handleNextClick} disabled={buttonDisabled}>Next</button>
//             </div>
//         </div>
//     );
// }

// export default Chatbot;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import './chatbot.css';
// import FileSource from "./FileSource/FileSource";
// import Catsel from './Catsel/Catsel';
// import CatalogCard from '../Catalog-card/CatalogCard';

// function Chatbot({ loggedUser }) {
//     const [existingCatalogs, setExistingCatalogs] = useState([]);
//     const [selectedCatalog, setSelectedCatalog] = useState(null);
//     const [buildCatalog, setBuildCatalog] = useState(false); 

//     useEffect(() => {
//         fetchExistingCatalogs();
//     }, []);

//     const fetchExistingCatalogs = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/catalogs');
//             setExistingCatalogs(response.data);
//         } catch (error) {
//             console.error('Error fetching existing catalogs:', error);
//         }
//     };

//     const handleCatalogSelection = (catalogId) => {
//         setSelectedCatalog(catalogId);
//     };

//     const handleBuildCatalogClick = () => {
//         setSelectedCatalog(null);
//         setBuildCatalog(true); // Set buildCatalog to true when button is clicked, opens the catsel, that's it. 
//     };

//     if (selectedCatalog) {
//         return <FileSource utypename={loggedUser} catalogId={selectedCatalog} />;
//     }

//     if (buildCatalog) {
//         // Redirect to Typessel component
//         // return <Link to="/typessel">Redirecting to Typessel...</Link>;
//         return <Catsel loggedUser={loggedUser} onNext={{ handleCatalogSelection }} />
//     }

//     return (
//         // <div className='maincon'>
//         //     <div className="catalog-selection">
//         //         <h2>Welcome</h2>
//         //         <p>Choose any of the existing catalogs or build a new one! </p>
//         //         <button className="next-button3" onClick={handleBuildCatalogClick}>New Catalog</button>
//         //         <div>
//         //             <h3>Existing Catalogs:</h3>
//         //             <div className="catalog-list">
//         //                 {existingCatalogs.map(catalog => (
//         //                     <div
//         //                         key={catalog.id}
//         //                         className="catalog-item"
//         //                         onClick={() => handleCatalogSelection(catalog.id)}
//         //                     >
//         //                         <button className='next-button2'>{catalog.name}</button>
//         //                     </div>
//         //                 ))}
//         //             </div>
//         //         </div>
//         //     </div>
//         // </div>
//         <>
//         <CatalogCard>
//             </CatalogCard></>
//     );
// }

// export default Chatbot;
//   <div className="catalog-grid">
//                 <div className="catalog-card">
//                     <h3 className="card-title">Sales</h3>
//                     <p className="card-description">Add Sales to the catalog to discover data related to Sales</p>
//                     <button
//                         className={`next-button5 ${selectedCatalog === "Sales" ? "connected" : ""}`}
//                         onClick={() => handleSelectCatalog("Sales")}
//                     >
//                         {selectedCatalog === "Sales" ? "Connected" : "Connect"}
//                     </button>
//                 </div>
//                 <div className="catalog-card">
//                     <h3 className="card-title">Business</h3>
//                     <p className="card-description">Add Business to the catalog to discover data related to Business</p>
//                     <button
//                         className={`next-button5 ${selectedCatalog === "Business" ? "connected" : ""}`}
//                         onClick={() => handleSelectCatalog("Business")}
//                     >
//                         {selectedCatalog === "Business" ? "Connected" : "Connect"}
//                     </button>
//                 </div>
//                 <div className="catalog-card">
//                     <h3 className="card-title">Product</h3>
//                     <p className="card-description">Add Product to the catalog to discover data related to Product</p>
//                     <button
//                         className={`next-button5 ${selectedCatalog === "Product" ? "connected" : ""}`}
//                         onClick={() => handleSelectCatalog("Product")}
//                     >
//                         {selectedCatalog === "Product" ? "Connected" : "Connect"}
//                     </button>
//                 </div>
//                 <div className="catalog-card">
//                     <h3 className="card-title">Marketing</h3>
//                     <p className="card-description">Add Marketing to the catalog to discover data related to Marketing</p>
//                     <button
//                         className={`next-button5 ${selectedCatalog === "Marketing" ? "connected" : ""}`}
//                         onClick={() => handleSelectCatalog("Marketing")}
//                     >
//                         {selectedCatalog === "Marketing" ? "Connected" : "Connect"}
//                     </button>
//                 </div>
//             </div> 



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatbot.css';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress'; 


function Chatbot({ loggedUser }) {
    const navigate = useNavigate();
    const [catalogs, setCatalogs] = useState([
        { name: "Sales", status: "" },
        { name: "Business", status: "" },
        { name: "Product", status: "" },
        { name: "Marketing", status: "" },
    ]);

    const steps = ['Catalog Selection', 'Data Source Selection', 'Data Selection', 'Finish'];


    const handleSelectCatalog = async (index) => {
        // Set the selected catalog to "connecting"
        const newCatalogs = [...catalogs];
        newCatalogs.forEach((catalog, idx) => {
            if (idx === index) {
                catalog.status = "connecting";
            } else {
                // Optionally reset other catalogs to ensure only one is "connecting"/"connected"
                catalog.status = "";
            }
        });
        setCatalogs(newCatalogs);
    
        // Wait for 2 seconds, then set the catalog to "connected"
        setTimeout(() => {
            const updatedCatalogs = [...newCatalogs];
            updatedCatalogs[index].status = "connected"; // Update the status to "connected"
            setCatalogs(updatedCatalogs);
        }, 2000); // Wait for exactly 2 seconds
    };
    

    return (
        <>
            <div className='main-header'>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={0} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </div>
            <div className="layout-container">
     
            <header className="layout-header">
                <h1 className='pagetitle'>Choose Your Catalog</h1>
                <p className='div-3'>Begin by selecting a single catalog you'd like to configure for the user. <br />This will help us tailor the data options to your specific user.</p>
            </header>
                <div className="catalog-grid">
                    {catalogs.map((catalog, index) => (
                        <div key={catalog.name} className="catalog-card">
                            <h3 className="card-title">{catalog.name}</h3>
                            <p className="card-description">Add {catalog.name} to the catalog to discover data related to {catalog.name}</p>
                            <button
                                className={`next-button5 ${catalog.status}`}
                                onClick={() => handleSelectCatalog(index)}
                            >
                                {catalog.status === "connecting" ? <CircularProgress size={24} /> : catalog.status === "connected" ? "Connected" : "Connect"}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="catalog-card-new">
                    <button className="catalog-button-create">+ Create New Catalog</button>
                </div>
                <div className="layout-footer">
                    <button
                        className="next-button"
                        onClick={() => navigate('/chatbot-2', { state: { selectedCatalog: catalogs.find(catalog => catalog.status === "connected")?.name } })}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default Chatbot;

