import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage"
//import ProjectPage from './Components/ProjectPage';
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
