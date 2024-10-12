import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import TransactionHistory from './TransactionHistory'
import Login from './Login';

function App() {


  return (
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
    </Routes>
</Router>
  )
}

export default App
