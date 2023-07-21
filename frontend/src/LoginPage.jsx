import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@fluentui/react';
//import { Button} from '@fluentui/react-components';
import Button from '@mui/material/Button';
import {FaCartArrowDown} from "react-icons/fa";
import Modal from 'react-modal';
import axios from 'axios'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function LoginPage() {
  const [user, setUserLogin] = useState({
    loginName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
  function saveLoginDetails () {
    axios.get('/signup/', {
        params: {
            user: user.loginName,
            first: user.firstName,
            last: user.lastName,
            email: user.email,
            password: user.password
        }
    })
    .then((response) => {
        if (response.status === 200) {
            console.log(response.data)
        }
    })
  }

  function verifyLoginDetails () {
    axios.get('/login/', {
        params: {
            user: user.loginName,
            password: user.password
        }
    })
    .then((response) => {
        if (response.status === 200) {
            console.log(response.data)
        }
    })
  }

  function handleChange(event){
    setUserLogin( prevValues => {
      return { ...prevValues,[event.target.name]: event.target.value}
    })
  }

  return (
    <div className="container">  
        <div className="row">  
          <div className='col-md-4'></div>
          <div className='col-md-4 loginContainer'>
            <div className='row'>
              <h3 style={{color: 'black'}}>Sign In to access the APAD Project</h3>
            </div>
            <div className="row">
              <FaCartArrowDown size={100} style={{color: 'black', marginTop:'2rem'}}/>
            </div>
            <div className='row'>
              <TextField
                  label='Login Name'
                  required
                  value = {user.loginName}
                  name='loginName'
                  onChange={(e)=> handleChange(e)}                
                />
            </div>
            <div className='row'>
              <TextField
                  label='Password'
                  required
                  value= {user.password}
                  name='password'
                  type='password'
                  onChange={(e)=> handleChange(e)}  
                />
            </div>
            <br></br>
            <div className='row'>
              <Button className='loginButtons' variant='outlined' style={{color:'black', border:'1px solid white'}} onClick={verifyLoginDetails}>Login</Button>              
            </div><br></br>
            <div className='row'>
              <Button className='loginButtons' variant='outlined' style={{color:'black', border:'1px solid white'}} onClick={openModal}>New user? Sign Up here</Button>              
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >                
                <h4>Please enter below details to create account</h4>
                <form>
                  <TextField
                    label='Login Name'
                    required
                    value={user.loginName}
                    name='loginName'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='First Name'
                    required
                    value={user.firstName}
                    name='firstName'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='Last Name'
                    required
                    value={user.lastName}
                    name='lastName'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='Email'
                    required
                    value={user.email}
                    type='email'
                    name='email'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='Password'
                    required
                    value={user.password}
                    type='password'
                    name='password'
                    onChange={(e)=>handleChange(e)}
                  />
                  <br></br>
                  <Button variant='outlined' onClick={saveLoginDetails}>Sign Up</Button>
                </form>
              </Modal>
            </div>
          </div>
          <div className='col-md-4'></div>                
      </div>
  </div>
  );
}

export default LoginPage;
