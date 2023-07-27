import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage"
import ProjectPage from './Components/ProjectPage';
import HardwareSets from './Components/HardwareSets';
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/ProjectPage" element={<ProjectPage />} />
        <Route path="/HardwareSets/:id" element={<HardwareSets />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
