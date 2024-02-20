import * as React from'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar/AppSidebar';

const ProtectedRoute = (props) => {
    return(
        <>
        {
            props.loggedUser?
            <div className='container'>
                <Sidebar setDashboardTitle={props.setDashboardTitle} selectedBrand={props.selectedBrand} loggedUser={props.loggedUser}/>
                <div className='authenticatedPage'><Outlet /></div>
            </div>
            :
            <Navigate to='/' />
        }
        </>
    )
}

export default ProtectedRoute;