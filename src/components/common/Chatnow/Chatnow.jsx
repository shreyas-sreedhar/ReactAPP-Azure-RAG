import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";
import "../Chatbot/chatbot.css"



const Chatnow = ({ loggedUser }) => {
  

    return (
        <>
            
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