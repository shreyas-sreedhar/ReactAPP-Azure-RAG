import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const VPSalesRoute = (props) => {
    return(
        <>
            {
                props.loggedUser.userType == 'VP Sales'?
                <Outlet />
                :
                <Navigate to='/home' />
            }
        </>
    )
}

export default VPSalesRoute;