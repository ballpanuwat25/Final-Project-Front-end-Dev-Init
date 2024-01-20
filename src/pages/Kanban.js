import React, { useState, useEffect } from 'react';
import Board from '../components/kanban/Board';

import Sidebar, { SidebarItem } from '../components/Sidebar';
import {
  LayoutDashboard,
  ListTodo,
  CalendarCheck,
  NotebookPen,
  Presentation,
} from 'lucide-react';

export default function Kanban() {
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
    setNotificationStatus(savedNotification);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={notificationStatus} path={"/"} />
        <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
        <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
        <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
        <SidebarItem icon={<Presentation size={20} />} text="Kanban" active={true} alert={false} path={"/kanban"} />
      </Sidebar>

      <div className="flex-1 p-4 overflow-scroll">
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-lg md:text-3xl font-bold'>Kanban 📚</h1>
        </div>

        <div className="divider my-2" />

        <Board />
      </div>
    </div>
  );
}