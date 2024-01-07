import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import Todo from './pages/Todo';
import Calendar from './pages/Calendar';
import Journals from './pages/Journals';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/todo',
    element: <Todo />,
  },
  {
    path: '/calendar',
    element: <Calendar />,
  },
  {
    path: '/journal',
    element: <Journals />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

reportWebVitals();