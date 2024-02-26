import React, { useState, useEffect } from 'react';
import { Box, Step, StepLabel, Stepper } from '@mui/material';

import { Link } from "react-router-dom";
import "../Chatbot/chatbot.css"



const Chatnow = ({ loggedUser }) => {
  
    const steps = ['Catalog Selection', 'Data Source Selection', 'Data Selection', 'Finish'];

    return (
        <>
            
            <div className='main-header'>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={4} alternativeLabel>
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
                    <h1 className='pagetitle'>Task Complete</h1>
                    <div className="div-3">
                        Click to go back home. 
                       <Link to="/"> <button className='next-button'> Go Home </button> </Link>
                    </div>
                </header>
                    </div>
        </>
    );
};

export default Chatnow;
