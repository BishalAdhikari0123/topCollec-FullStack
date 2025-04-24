// App.js
import './App.css';
import Header from './components/header.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from './pages/login.js'; 
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header /> 
        
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
