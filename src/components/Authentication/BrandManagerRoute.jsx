import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const BrandManagerRoute = (props) => {
    return(
        <>
        {
            props.loggedUser.userType == 'Brand Manager'?
            <Outlet />
            :
            <Navigate to='/home' />
        }
        </>
    )
}

export default BrandManagerRoute;