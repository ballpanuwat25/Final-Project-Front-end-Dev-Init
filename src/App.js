import React, { useEffect, useState } from 'react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen, Presentation } from 'lucide-react';

import Notification from './components/Notification';
import TodoComponent, { TaskTodayComponent } from './components/layout/TodoComponent';
import ScheduleComponent from './components/layout/ScheduleComponent';
import Countdown from './components/layout/Countdown';

import { Link } from 'react-router-dom';

const App = () => {
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
    setNotificationStatus(savedNotification);
  }, []);

  return (
    <div style={{ height: "100dvh" }} className="flex">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={true} alert={notificationStatus} path={"/"} />
        <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
        <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
        <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
        <SidebarItem icon={<Presentation size={20} />} text="Kanban" active={false} alert={false} path={"/kanban"} />
      </Sidebar>

      <div className="flex-1 p-4 overflow-scroll">
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-lg md:text-3xl font-bold'>Dashboard ✨</h1>

          <Notification />
        </div>

        <div className="divider my-2" />

        <TodoComponent />

        <div className='mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
          <TaskTodayComponent />

          <ScheduleComponent />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto'>
          <Countdown />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='rounded-lg p-4 bg-primary'>
              <h1 className='text-lg md:text-2xl font-bold text-primary-content mb-4'>Start your day with Daily Journal.</h1>
              <Link to='/journal' className='btn w-full'>
                Go to journal~
              </Link>
            </div>
            <div className='rounded-lg p-4 bg-secondary'>
              <h1 className='text-lg md:text-2xl font-bold text-secondary-content mb-4'>Plan your day with Kanban Board.</h1>
              <Link to='/kanban' className='btn w-full'>
                Go to Kanban~
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
