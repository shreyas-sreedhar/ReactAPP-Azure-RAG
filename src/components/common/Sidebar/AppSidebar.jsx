import './sidebar.css'
import { FiHome } from "react-icons/fi";
import { RiBardFill } from "react-icons/ri";
import {PiUserCircle, PiBellSimpleLight, PiGlobeHemisphereWestBold, PiChartLineUpBold } from "react-icons/pi"
import { TbLayoutSidebarLeftExpandFilled,TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb"
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

const Sidebar = (props) => {
    const [activeLink, setActiveLink] = useState(null);
    const [expand, setExpand] = useState(false);
    const location = useLocation();

    const links = [
        { icon: <img className='white-to-black' src="/images/icons/home.png" alt="" width={25}/>, path: '/home', title:'Home', access:['Brand Manager','VP Sales','Field Rep'] },
        { icon: <img className='white-to-black' src="/images/icons/tab.png" alt="" width={20}/>, path: '/brandperformance', title:'Brand Performance', access:['Brand Manager'] },
        { icon: <img className='white-to-black' src="/images/icons/speed.png" alt="" width={20}/>, path: '/hcpperformance', title:'HCP Performance', access:['Brand Manager'] },
        { icon: <PiChartLineUpBold />, path: '/ffactivity', title:'Field Force Activity', access:['VP Sales'] },
        { icon: <PiGlobeHemisphereWestBold />, path: '/ffoperationsvp', title:'Field Force Operations - VP', access:['VP Sales'] },
        { icon: <PiGlobeHemisphereWestBold />, path: '/ffoperationsrep', title:'Field Force Operations - Rep', access:['Field Rep'] },
        { icon: <img className='white-to-black' src="/images/icons/note.png" alt="" width={20}/>, path: '/qna', title:'Q&A', access:['Brand Manager','VP Sales','Field Rep'] },
        { icon: <RiBardFill />, path: '/chatbot', title:'ChatBot', access:['Brand Manager','VP Sales','Field Rep'] },

    ];


    useEffect(() => {
        const path = location.pathname;
        const activeIndex = links.findIndex(link => link.path === path);
        setActiveLink(activeIndex);
        props.setDashboardTitle(links[activeIndex]?.title)
    }, [location]);

    useEffect(()=>{
        let nextBot = document.getElementById('next-bot');
        let iconWrapper = document.getElementById('chatbot-icon-wrapper');
        if(nextBot){
            document.body.removeChild(nextBot);
            iconWrapper?.appendChild(nextBot);
            nextBot.style.display='block';            
        }

        return ()=>{
            if(nextBot){
                iconWrapper.removeChild(nextBot);
                document.body.appendChild(nextBot);
                nextBot.style.display = 'none';                
            }
        }
    },[])

    return (
        <div className={"sidebar"+(expand?' sidebar-expand':'')}>
            <div className='logo'>
                <img className='white-to-black' src="/images/logo/logo.svg" alt="" />
            </div>
            <div className='expandCollapseIcon'>
                <div onClick={()=>setExpand(!expand)}>
                    {
                        !expand ?
                        <TbLayoutSidebarLeftExpandFilled size={20} id='expandIcon'/>
                        :
                        <TbLayoutSidebarLeftCollapseFilled size={20} id='collapseIcon'/>
                    }
                </div>
            </div>
            <div className="options">
                {links.map((link, index) => {
                    return(
                        link.access?.includes(props.loggedUser.userType) &&
                        <Link key={index} to={link.path} className={'sidebarOption'+(activeLink === index ? ' active' : '')} title={link.title}>
                            {link.icon} 
                            {expand && <span>{link.title}</span>}
                        </Link>
                    )
                })}
            </div>
            <div className='sidebarIcons'>
                <div>
                    <PiBellSimpleLight />
                </div>
                <div>
                    <PiUserCircle />
                </div>
                <div id='chatbot-icon-wrapper'>

                </div>
            </div>
            
        </div>
        
    );
}

export default Sidebar;
