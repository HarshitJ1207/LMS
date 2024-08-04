import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/member/Home';
import Books from './pages/member/Books';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Books" element={<Books />} />
      </Routes>
    </div>
  );
}

export default App;