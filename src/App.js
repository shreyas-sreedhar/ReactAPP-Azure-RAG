import * as React from 'react';
import Home from './components/Home/AppHome';
import Layout from './components/Layout/AppLayout';
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Dashboard from './components/common/Dashboard/Dashboard';
import data from './data/brandData.json'
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import Login from './components/Authentication/Login';
import Index from './components/Index';
import Chatbot from './components/common/Chatbot/Chatbot';
import BrandManagerRoute from './components/Authentication/BrandManagerRoute';
import VPSalesRoute from './components/Authentication/VPSalesRoute';
import FieldRepRoute from './components/Authentication/FieldRepRoute';

function App() {

  const [theme, setTheme] = React.useState('dark')
  const [dashboardTitle, setDashboardTitle] = React.useState('');
  const [selectedTA, setSelectedTA] = React.useState(0);
  const [selectedBrand, setSelectedBrand] = React.useState(0);
  const [loggedUser, setLoggedUser] = React.useState(sessionStorage.getItem('nvsLoggedUser')?JSON.parse(sessionStorage.getItem('nvsLoggedUser')):null);

  React.useEffect(()=>{
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    
    if(theme == 'dark') link.href = '../themes/dark.css';
    else link.href = '../themes/light.css';

    head.appendChild(link);

    return () => { 
      head.removeChild(link); 
    }

  },[theme])

  return (
    <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Index />} />
          <Route exact path='/login' element={<Login setLoggedUser={setLoggedUser}/>} />
          <Route path='/' element={<ProtectedRoute loggedUser={loggedUser} setDashboardTitle={setDashboardTitle} selectedBrand={selectedBrand}/>}>
            <Route path='/' element={<Dashboard dashboardTitle={dashboardTitle} selectedTA={selectedTA} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} loggedUser={loggedUser} theme={theme} setTheme={setTheme}/>}>
              <Route exact path='/home' element={<Home selectedTA={selectedTA} setSelectedTA={setSelectedTA} setSelectedBrand={setSelectedBrand} loggedUser={loggedUser}/>} />
              <Route path='/' element={<BrandManagerRoute loggedUser={loggedUser}/>} >
                <Route exact path="/brandperformance" element={<Layout link={data.ta[selectedTA]?.brands[selectedBrand]?.brandPerformanceLink[theme]}/>} />
                <Route exact path="/hcpperformance" element={<Layout link={data.ta[selectedTA]?.brands[selectedBrand]?.hcpPerformanceLink[theme]}/>} />
              </Route>
              <Route path='/' element={<VPSalesRoute loggedUser={loggedUser} />}>
                <Route exact path="/ffactivity" element={<Layout link={data.ta[selectedTA]?.brands[selectedBrand]?.fieldForceActivityLink[theme]}/>} />
                <Route exact path="/ffoperationsvp" element={<Layout link={data.ta[selectedTA]?.brands[selectedBrand]?.fieldForceOperationsVPLink[theme]}/>} />
              </Route>
              <Route path='/' element={<FieldRepRoute loggedUser={loggedUser} />}>
                <Route exact path="/ffoperationsrep" element={<Layout link={data.ta[selectedTA]?.brands[selectedBrand]?.fieldForceOperationsRepLink[theme]}/>} />
              </Route>
              <Route exact path='/qna' element={<Layout link={data.qna} />} />
            </Route>
            <Route exact path='/chatbot' element={<Chatbot loggedUser={loggedUser} />} />
            
            <Route path='*' element={<div className='dataPlaceholder'>VIEW COMING SOON!</div>} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
