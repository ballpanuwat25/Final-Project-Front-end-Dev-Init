import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import Todo from './pages/Todo';
import Schedule from './pages/Schedule';
import Journals from './pages/Journals';
import Kanban from './pages/Kanban';

const routes = [
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
    path: '/kanban',
    element: <Kanban />,
  },
];

const router = createBrowserRouter({
  routes
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

reportWebVitals();
