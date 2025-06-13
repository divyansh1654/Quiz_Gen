import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AiPage from './AiGenQ/AiPage.jsx';
import CreateMan from './ManualCreate/ManCreate.jsx';
import ExamPage from './Exam/[ExamId]/index.jsx';
import FeaturePage from './pages/Features.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Finresult from './final/result.jsx';
import BookmarkPage from './pages/Bookmarks.jsx';
import LearnPage from './final/Information.jsx';
import Profile from './pages/profile.jsx';
import NotesPage from './pages/Notes.jsx';


const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />,
  },
  {
    path: '/AiGenQ', 
    element: <AiPage />,
  }, 
  {
    path: '/ManualCreate', 
    element: <CreateMan />,
  },
  {
    path: '/Exam/:ExamId', 
    element: <ExamPage/>,
  },
  {
    path: '/features',  
    element: <FeaturePage />,
  }
  ,
  {
    path: '/result',  
    element: <Finresult />,
  },
  {
    path: '/bookmarks',  
    element: <BookmarkPage/>,
  },
  {
    path: '/Learn/:ExamId',  
    element: <LearnPage/>,
  }
  ,
  {
    path: '/Profile',  
    element: <Profile/>,
  },
  {
    path: '/Notes',  
    element: <NotesPage/>,
  }

]);


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </GoogleOAuthProvider>
  </React.StrictMode>
);













