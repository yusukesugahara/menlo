import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import KeywordPosts from './pages/KeywordPosts';
import EditPost from './pages/EditPost'; 
import Login from './pages/Login'; 
import SignUp from './pages/SignUp'; 
import UserPage from './pages/UserPage';
import AuthorPosts from './pages/AuthorPosts'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/posts" element={<KeywordPosts />} /> 
        <Route path="/edit/:id" element={<EditPost />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="/author/:authorId" element={<AuthorPosts />} />
      </Routes>
    </Router>
  );
}

export default App;
