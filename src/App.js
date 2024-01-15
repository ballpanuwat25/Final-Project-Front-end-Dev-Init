import React, { useEffect, useState } from 'react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen } from 'lucide-react';

import Notification from './components/Notification';
import TodoComponent from './components/layout/TodoComponent';
import ScheduleComponent from './components/layout/ScheduleComponent';

const App = () => {
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
    setNotificationStatus(savedNotification);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={true} alert={notificationStatus} path={"/"} />
        <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
        <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
        <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
      </Sidebar>

      <div className="flex-1 p-4 overflow-scroll">
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-lg md:text-3xl font-bold'>Dashboard ✨</h1>

          <Notification />
        </div>

        <div className="divider my-2" />

        <div>
          <TodoComponent />
        </div>

        <div className='bg-red-500 mt-4 flex flex-row gap-4 h-1/3'>
          <div className='bg-red-300 w-full rounded'>
            <div>
              <div>Add tasks for Today</div>
              <div>Add your journal</div>
            </div>
          </div>

          <div className='bg-red-200 w-full rounded'>Timer</div>
        </div>

        <div>
          <ScheduleComponent />
        </div>
      </div>
    </div>
  );
};

export default App;
