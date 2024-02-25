import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ConfiguratorRoute = (props) => {
    return(
        <>
            {
                props.loggedUser.userType === 'Configurator'?
                <Outlet />
                :
                <Navigate to='/home' />
            }
        </>
    )
}

export default ConfiguratorRoute;