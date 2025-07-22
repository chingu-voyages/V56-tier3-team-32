import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StatusList from './components/StatusList';
import PatientForm from "./components/PatientForm"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<PatientForm />} />
        <Route path="/status" element={<StatusList />} />
      </Routes>
    </Router>   
  );
}

export default App;
