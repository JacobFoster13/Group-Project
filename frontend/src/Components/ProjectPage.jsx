import React, {useState, useEffect} from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@fluentui/react';
//import { Button} from '@fluentui/react-components';
import Button from '@mui/material/Button';
import Modal from 'react-modal';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


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

function ProjectPage() {

  const navigate = useNavigate();
  let {state} = useLocation();

  const [userProjects, setUserProjects] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Function to fetch user projects from Flask server
    const fetchUserProjects = async () => {
      try {
        const response = await axios.post('/get_user_projects/', {
          params: {
            user: state.userId
          }
        });
        setUserProjects(response.data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    };

    // Call the function to fetch user projects when the component mounts
    fetchUserProjects();
  }, []);

  // Update the rows state after userProjects has been fetched
  useEffect(() => {
    setRows(userProjects);
  }, [userProjects]);

  console.log(userProjects);

  const columns = [
    { field: 'projectID', headerName: 'Project ID', width: 200, 
      renderCell: (params) => 
      <a className="projectLink" href={"/hardwareSets/" + params.row.projectID}>{params.row.projectID}</a>
    },
    { field: 'projectName', headerName: 'Project Name', width: 300 },
    { field: 'hwSet1', headerName: 'Hardware Set 1', width: 150 },
    { field: 'hwSet2', headerName: 'Hardware Set 2', width: 150 }
  ];

  const [project, setProject] = useState({
    projectID: 0,
    projectsData: [],
    projectName: '',
    projectDescription: '',
    projectUsers : [],
    loginName: state.userId
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

  function joinProject() {
    // Call the API endpoint to join the project using axios
    axios.post('/join_project/', {
      params: {
        user: state.userId, // Replace with the actual user ID
        projectID: project.projectID
      }
    })
    .then(response => {
      const data = response.data;
      // Handle the response from the server
      alert(data.Message); // Show a message with the server response
      // If the join was successful, update the rows state to refresh the table
      if (data.Message === 'User successfully joined the project') {
        setRows(prevRows => [
          ...prevRows,
          {
            id: prevRows.length + 1,
            projectID: project.projectID,
            projectName: 'Project Name', // Replace with the actual project name
            hwSet1: '200',
            hwSet2: '230'
          }
        ]);
      }
    })
    .catch(error => {
      console.error('Error joining project:', error);
      alert('An error occurred while joining the project');
    });
  }

  function createProject(){
    axios.post('/projects/', {
        params: {
            projectID: project.projectID,
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            creator: project.loginName,
            user: project.loginName
        }
    })
    .then((response) => {
        if (response.status === 200) {
            console.log(response.data);
            navigate('/hardwareSets')
        }
    })
  }

  function handleChange(event){
    setProject( prevValues => {
      return { ...prevValues,[event.target.name]: event.target.value}
    });
    if(event.target.name === "projectName" || event.target.name === "projectDescription"){
      //setProjectID();
    }
  }

  function setProjectID(){
    let projectID = "";
    projectID = 1000;
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