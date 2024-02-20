import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const Dashboard = (props) => {
    return(
        <div className="dashboard">
          <Header 
            headerTitle={props.dashboardTitle} 
            setSelectedBrand={props.setSelectedBrand}
            selectedBrand={props.selectedBrand} 
            selectedTA={props.selectedTA}
            loggedUser={props.loggedUser}
            theme={props.theme}
            setTheme={props.setTheme}
          />
          <Outlet />
        </div>
    )
}

export default Dashboard;