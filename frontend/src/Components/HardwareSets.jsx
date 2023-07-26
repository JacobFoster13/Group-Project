import React, {useState} from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@fluentui/react';
//import { Button} from '@fluentui/react-components';
import Button from '@mui/material/Button';


function HardwareSets() {
  const [hwSets, setHWSets] = useState({
    projectID: '',
    projectsData: [],
    projectName: '',
    projectDescription: '',
    hwSet1: [],
    hwSet2: []
  });

  function createProject(){

  }

  function handleChange(event){
    setHWSets( prevValues => {
      return { ...prevValues,[event.target.name]: event.target.value}
    });
    if(event.target.name === "projectName" || event.target.name === "projectDescription"){
      setProjectID();
    }
  }

  function setProjectID(){
    let projectID = "";
    projectID = hwSets.projectName.substring(3) + hwSets.projectDescription.trim().substring(3);
    setHWSets( prevValues => {
      return { ...prevValues,'projectID': projectID}
    });
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
              <h2 className='hwSetsHeading'>PROJECT NAME: </h2>
              <h3 className='hwSetsHeading'>PROJECT ID: </h3>
            </div>
            <div className='row'>
              <div className='hardwareSetContainer'>
                <TextField
                  label='Project Description:'
                  required
                  value = {hwSets.projectDescription}
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
              <Button className="hwSetButton" variant='outlined' onClick={createProject}>Check in</Button>
              <Button className="hwSetButton" variant='outlined' onClick={createProject}>Check out</Button>
            </div>
            <br></br>                     
          </div>
      </div>
  </div>
  );
}

export default HardwareSets;