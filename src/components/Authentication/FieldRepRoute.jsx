import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const FieldRepRoute = (props) => {
    return(
        <>
            {
                props.loggedUser.userType == 'Field Rep'?
                <Outlet />
                :
                <Navigate to='/home' />
            }
        </>
    )
}

export default FieldRepRoute;