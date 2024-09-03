import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage';
import EditPost from './pages/EditPost'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} /> 
        <Route path="/edit/:id" element={<EditPost />} /> 
      </Routes>
    </Router>
  );
}

export default App;
