import * as React from 'react';
import './header.css';
import data from '../../../data/brandData.json';
import { useNavigate } from 'react-router-dom';
import { MdDarkMode, MdLight, MdLightMode } from 'react-icons/md';

const Header = (props) => {

    const navigate = useNavigate();

    const [displayUserOptions, setDisplayUserOptions] = React.useState(false);
    const [displayBrandFilter, setDisplayBrandFilter] = React.useState(true);

    function logoutUser(){
        sessionStorage.removeItem('nvsLoggedUser');
        navigate('/');
    }

    React.useEffect(()=>{
        if(window.location.href.includes('home') || window.location.href.includes('qna')) 
            setDisplayBrandFilter(false);
        else 
            setDisplayBrandFilter(true);
    },[navigate])

    return(
        <div id='header'>
            <div className={'brandFilter'+(!displayBrandFilter?' brandFilter-hidden':'')}>
                <span>BRAND</span>
                <div className='brandSelector'>
                    {
                        data.ta[props.selectedTA]?.brands.map((brand,index) => {
                            return(
                                <div 
                                    className={'brandName'+(index == props.selectedBrand?' activeBrand':'')}
                                    onClick={()=>props.setSelectedBrand(index)}
                                >
                                    {brand.name}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <h1 className='title'>{props.headerTitle}</h1>
            <div className='userSection'>
                <div className='details'>
                    <p>{props.loggedUser.userName}</p>
                    <p><i>Logged in as {props.loggedUser.userType}</i></p>
                </div>
                <div className='iconWrapper' id='userIconWrapper' onClick={()=>setDisplayUserOptions(!displayUserOptions)}>
                    <img src="/images/icons/user.png" alt="" width={30} className={props.theme=='light'?'invert':''}/>
                    {
                        displayUserOptions &&
                        <div id='userOptions'>
                            <ul>
                                <li onClick={logoutUser}>Logout</li>
                            </ul>
                        </div>
                    }
                </div>
                <div className='iconWrapper'>
                    <div id='themeSelector'>
                        <div className={'themeOption'+(props.theme=='dark'?' themeOptionSelected':'')} onClick={()=>props.setTheme('dark')} title='dark theme'>
                            <MdDarkMode size={20}/>
                        </div>
                        <div className={'themeOption'+(props.theme=='light'?' themeOptionSelected':'')} onClick={()=>props.setTheme('light')} title='light theme'>
                            <MdLightMode size={20}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;