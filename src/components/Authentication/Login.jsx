import * as React from 'react';
import './login.css';
import data from '../../data/userData.json';
import { useNavigate } from 'react-router-dom';
import { MdErrorOutline } from "react-icons/md";

const Login = (props) => {

    const navigate = useNavigate();
    const initialState = {
        username:'',
        password:''
    }

    const [formData, setFormData] = React.useState(initialState);

    function loginUser(){
        if(!formData.username || !formData.password){
            showLoginError('All input is required!');
            return;
        }

        let fetchedUser = data.users.filter(user => user.userName === formData.username);
        if(!fetchedUser || fetchedUser.length == 0){
            showLoginError('Username not found!')
            return;
        }

        if(fetchedUser[0].password !== formData.password){
            showLoginError('Invalid Password!');
            return;
        }

        props.setLoggedUser(fetchedUser[0]);
        sessionStorage.setItem('nvsLoggedUser',JSON.stringify(fetchedUser[0]))
        navigate('/home')
    }

    function showLoginError(msg){
        let loginErrorDiv = document.getElementById('loginError');
        loginErrorDiv.getElementsByClassName('errorText')[0].innerText = msg;
        loginErrorDiv.style.display = 'flex';
    }

    return(
        <div id='loginPage'>
            <div className='logoSection'></div>
            <div className='formSection'>
                <div className='form'>
                    <small>Login to view dashboards.</small>
                    <label htmlFor="">Username</label>
                    <input type="text" value={formData.username} onChange={(e)=>setFormData({...formData, username:e.target.value})}/>
                    <label htmlFor="">Password</label>
                    <input type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password:e.target.value})}/>
                    <button onClick={loginUser}>Login</button>
                </div>
                <div className='formError' id='loginError'>
                    <MdErrorOutline size={20}/>
                    <span className='errorText'>Username not found!</span>
                </div>
            </div>
        </div>
    )
}

export default Login;