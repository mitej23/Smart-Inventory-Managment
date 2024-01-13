import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/orders" exact element={<Orders />} />
        <Route path="/" exact element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;