import React from 'react';
import Sidebar, { SidebarItem } from './components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen } from 'lucide-react';

import ScheduleComponent from './components/layout/ScheduleComponent';
import TodoComponent from './components/layout/TodoComponent';

const App = () => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={true} alert={false} path={"/"} />
        <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={true} path={"/todo"} />
        <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
        <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
      </Sidebar>

      <div className="flex-1 h-screen p-4">
        <div className="flex flex-col w-full h-full gap-4">
          <div className="flex flex-col w-full h-full p-0">
            <div className='w-full h-full rounded'>
              <ScheduleComponent />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full h-full gap-4">
            <div className='bg-primary bg-opacity-50 w-full h-full rounded'>
              <TodoComponent />
            </div>

            <div className='bg-secondary bg-opacity-50 w-full h-full rounded'>
              3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
