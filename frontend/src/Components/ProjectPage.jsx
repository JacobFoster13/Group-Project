import React, {useState} from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@fluentui/react';
//import { Button} from '@fluentui/react-components';
import Button from '@mui/material/Button';
import Modal from 'react-modal';
import { DataGrid } from '@mui/x-data-grid';


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

const rows = [
  { id: 1, projectID: 'TEST123', projectName: 'Test Project 1', hwSet1: '200', hwSet2: '230' },
  { id: 2, projectID: 'TEST234', projectName: 'Test Project 3', hwSet1: '200', hwSet2: '230' },
  { id: 3, projectID: 'TEST345', projectName: 'Test Project 3', hwSet1: '200', hwSet2: '230' },
  { id: 4, projectID: 'TEST456', projectName: 'Test Project 4', hwSet1: '200', hwSet2: '230' },
];

const columns = [
  { field: 'projectID', headerName: 'Project ID', width: 200 },
  { field: 'projectName', headerName: 'Project Name', width: 300 },
  { field: 'hwSet1', headerName: 'Hardware Set 1', width: 150 },
  { field: 'hwSet2', headerName: 'Hardware Set 2', width: 150 }
];


function ProjectPage() {
  const [project, setProject] = useState({
    projectID: '',
    projectsData: [],
    projectName: '',
    projectDescription: ''
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
  function joinProject(){

  }

  function createProject(){

  }

  function handleChange(event){
    setProject( prevValues => {
      return { ...prevValues,[event.target.name]: event.target.value}
    });
    if(event.target.name === "projectName" || event.target.name === "projectDescription"){
      setProjectID();
    }
  }

  function setProjectID(){
    let projectID = "";
    projectID = project.projectName.substring(3) + project.projectDescription.trim().substring(3);
    setProject( prevValues => {
      return { ...prevValues,'projectID': projectID}
    });
  }

  return (
    <div className="container projectContainer">  
        <div className="row">  
          <div className='col-md-12'>
            <div className='row'>
              <h2 className='projectHeading'>WELCOME TO YOUR PROJECTS DASHBOARD</h2>
            </div>
            <div className="row">
              <div className='col-md-4'>
                <div className='row'>
                  <TextField
                    label='Enter Project ID'
                    required
                    value = {project.projectID}
                    name='projectID'
                    onChange={(e)=> handleChange(e)}                
                  />
                </div>
              </div>
              <div className='col-md-2'>
                <br></br>
                <div className='row'>
                  <Button className='loginButtons' variant='outlined' style={{color:'white', border:'1px solid white'}} onClick={joinProject}>Join Project</Button>              
                </div>    
              </div>   
            </div>
            <div className='row'>
              <div className='col-md-4'>               
                <br></br>
                <div style={{marginTop: '1rem'}}>
                  <Button className='loginButtons' variant='outlined' style={{color:'white', border:'1px solid white'}} onClick={openModal}>Create Project</Button>              
                </div>                  
              </div>
            </div>
            <br></br>            
            <div className='row'>
              <div className='col-md-8 dataTable'>
                <DataGrid rows={rows} columns={columns} pageSize={2} />          
              </div>              
            </div>            
            <div className='row'>
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >                
                <h4>Please enter below details to create a new project</h4>
                <form>
                  <TextField
                    label='Project Name'
                    required
                    value={project.projectName}
                    name='projectName'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='Project Description'
                    required
                    multiline
                    value={project.projectDescription}
                    name='projectDescription'
                    onChange={(e)=>handleChange(e)}
                  />
                  <TextField
                    label='Project ID'
                    disabled
                    value={project.projectID}
                    name='projectID'
                    onChange={(e)=>handleChange(e)}
                  />              
                  <br></br>                          
                  <Button variant='outlined' onClick={createProject}>Create Project</Button>
                </form>
              </Modal>
            </div>
          </div>
      </div>
  </div>
  );
}

export default ProjectPage;