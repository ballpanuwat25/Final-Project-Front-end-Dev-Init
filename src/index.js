import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import Todo from './pages/Todo';
import Schedule from './pages/Schedule';
import Journals from './pages/Journals';
import Test from './pages/Test';

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
    path: '/schedule',
    element: <Schedule />,
  },
  {
    path: '/journal',
    element: <Journals />,
  },
  {
    path: '/test',
    element: <Test />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

reportWebVitals();