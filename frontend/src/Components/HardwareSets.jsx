import React, {useState, useEffect} from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@fluentui/react';
//import { Button} from '@fluentui/react-components';
import Button from '@mui/material/Button';
import {useLocation, useNavigate} from 'react-router-dom';


function HardwareSets() {
  const navigate = useNavigate();
  let {state} = useLocation();

  console.log(state);
  const [hwSets, setHWSets] = useState({
    projectID: '',
    projectsData: [],
    projectName: '',
    projectDescription: '',
    hwSet1: [],
    hwSet2: []
  });

  useEffect(() => {
    if(state == null){
      navigate('/')
    }
    else{
      //Code for hardware sets
    }    
  }, []);

  function handleChange(event){
    setHWSets( prevValues => {
      return { ...prevValues,[event.target.name]: event.target.value}
    });

  }

  function checkIn(){

  }

  function checkOut(){

  }

  const hwSetsData = [
    { name: 'HW Set 1', capacity: 250, availability: 150, requested: 0 },
    { name: 'HW Set 2', capacity: 300, availability: 250, requested: 0 }
  ];

  return (
    <div className="container hwSetsContainer">  
        <div className="row">  
          <div className='col-md-12'>
            <div className='row'>
              <h2 className='hwSetsHeading'>PROJECT NAME: {state == null? '' : state.projectName}</h2>
              <h3 className='hwSetsHeading'>PROJECT ID: {state == null? '' : state.projectId}</h3>
            </div>
            <div className='row'>
              <div className='hardwareSetContainer'>
                <TextField
                  label='Project Description:'
                  required
                  value = {state == null? '' : state.projectDescription}
                  name='projectDesc'
                  onChange={(e)=> handleChange(e)}       
                  disabled
                  multiline         
                />
              </div>
            </div>            
            <div className='row'>
              <div className='col-md-12'>               
                {hwSetsData.map((item)=>{
                  return(
                    <div className='row'>
                      <div className='col-md-2 hardwareSetName'>
                        {item.name}
                      </div>
                      <div className='col-md-3'>
                        <TextField
                          label='Capacity'
                          value = {item.capacity}
                          name='capacity'      
                          disabled                                 
                        />
                      </div>
                      <div className='col-md-3'>
                        <TextField
                          label='Available'
                          value = {item.availability}
                          name='Available'      
                          disabled                                 
                        />
                      </div>
                      <div className='col-md-3'>
                        <TextField
                          label='Request'
                          required
                          value = {item.availability}
                          name='Request'
                          onChange={(e)=>handleChange(e)}      
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='row hwSetButtons'>
              <Button className="hwSetButton" variant='outlined' onClick={checkIn}>Check in</Button>
              <Button className="hwSetButton" variant='outlined' onClick={checkOut}>Check out</Button>
            </div>
            <br></br>                     
          </div>
      </div>
  </div>
  );
}

export default HardwareSets;