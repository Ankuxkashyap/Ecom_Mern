import './App.css';
// import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/auth';

function App() {

  return (
    <>
     <Router>
       <Routes>
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
          <Route path="/auth" element={<AuthForm />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
