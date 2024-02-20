import * as React from 'react';
import './home.css';
import data from '../../data/brandData.json';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
    console.log(props);
    const navigate = useNavigate();

    function selectBrand(index){
        props.setSelectedBrand(index);
        switch(props.loggedUser.userType){
            case "Brand Manager":
                navigate('/brandperformance');
                break;
            case "VP Sales":
                navigate('/ffactivity');
                break;
            case "Field Rep":
                navigate('/ffoperations');
        }
    }
    
    return (
        <div id='home'>
            <div className='contentWrapper'>
                <div className='therapeuticAreas'>
                    {
                        data.ta.map((area,index) => {
                            return (
                                <p 
                                    key={index}
                                    className={index === props.selectedTA ? 'activeTA ': ''}
                                    onClick={()=>props.setSelectedTA(index)}
                                >
                                    {area.name}
                                </p>
                            )
                        })
                    }
                </div>
                <div className='brands'>
                    <ul id='brandList'>
                        {
                            data.ta[props.selectedTA]?.brands.map((brand, index) => {
                                return (
                                    <li key={index} className='brandItem' onClick={()=>selectBrand(index)}>
                                        <img src={brand.logo} alt=""/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default Home;