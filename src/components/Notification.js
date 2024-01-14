import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { formatDate } from '../utils/dateUtils';

function Notification() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [todoNotifications, setTodoNotifications] = useState([]);
  const [scheduleNotifications, setScheduleNotifications] = useState([]);

  useEffect(() => {
    getAllNotification();
    getTodoNotification();
    getScheduleNotification();
  }, []);

  const getAllNotification = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];

    const approachingTasks = savedTasks.filter(task =>
      differenceInDays(new Date(task.task_dueDate), new Date()) < 3 &&
      differenceInDays(new Date(task.task_dueDate), new Date()) >= 0 &&
      task.task_readStatus === "Unread"
    );

    const approachingMeetings = savedMeetings.filter(meeting =>
      differenceInDays(new Date(meeting.meet_startDate), new Date()) < 3 &&
      differenceInDays(new Date(meeting.meet_startDate), new Date()) >= 0 &&
      meeting.meet_readStatus === "Unread"
    );

    const combinedApproaching = [...approachingTasks, ...approachingMeetings];

    if (combinedApproaching.length > 0) {
      localStorage.setItem('notificationStatus', JSON.stringify(true));
      setAllNotifications(combinedApproaching);
    } else {
      localStorage.setItem('notificationStatus', JSON.stringify(false));
    }
  };

  const getTodoNotification = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const approachingTasks = savedTasks.filter(task =>
      differenceInDays(new Date(task.task_dueDate), new Date()) < 3 &&
      differenceInDays(new Date(task.task_dueDate), new Date()) >= 0 &&
      task.task_readStatus === "Unread"
    );

    if (approachingTasks.length > 0) {
      setTodoNotifications(approachingTasks);
    }
  };

  const getScheduleNotification = () => {
    const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];
    const approachingMeetings = savedMeetings.filter(meeting =>
      differenceInDays(new Date(meeting.meet_startDate), new Date()) < 3 &&
      differenceInDays(new Date(meeting.meet_startDate), new Date()) >= 0 &&
      meeting.meet_readStatus === "Unread"
    );

    if (approachingMeetings.length > 0) {
      setScheduleNotifications(approachingMeetings);
    }
  };

  const clearNotification = () => {
    localStorage.setItem('notificationStatus', JSON.stringify(false));
    setAllNotifications([]);

    setTodoNotifications(prevTodoNotifications => {
      const updatedTodoNotifications = prevTodoNotifications.map(item => ({ ...item, task_readStatus: "Read" }));
      localStorage.setItem('tasks', JSON.stringify(updatedTodoNotifications));
      return updatedTodoNotifications;
    });

    setScheduleNotifications(prevScheduleNotifications => {
      const updatedScheduleNotifications = prevScheduleNotifications.map(item => ({ ...item, meet_readStatus: "Read" }));
      localStorage.setItem('meetings', JSON.stringify(updatedScheduleNotifications));
      return updatedScheduleNotifications;
    });

    window.location.reload();
  };


  const [selectedTab, setSelectedTab] = useState('All');

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <button>
        <div tabIndex={0} role="button" className="btn btn-sm btn-circle btn-primary">
          <Bell size={16} />
        </div>
        {allNotifications.length > 0 && (
          <div className="w-2 h-2 bg-accent rounded-full absolute top-0 right-0" />
        )}
      </button>

      <ul tabIndex={0} className="dropdown-content z-[1] top-10 menu p-2 shadow bg-base-100 border rounded-box w-72 xl:w-80 2xl:w-96">
        <div className='flex items-center justify-between py-1 px-2 gap-2'>
          <h1 className='text-lg font-semibold'>Notifications 🔔</h1>

          <button className='underline text-primary' onClick={clearNotification}>Clear all</button>
        </div>

        <div role="tablist" className="tabs tabs-lifted mt-2">
          <input type="radio" name="my_tabs" id="tab1" role="tab" className="tab" aria-label="All" checked={selectedTab === 'All'} onChange={() => handleTabChange('All')} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-4">
            {allNotifications.length > 0 ? (
              allNotifications.map((item) => (
                <li key={item.task_id || item.meet_id}>
                  <div className='pl-2'>
                    {item.task_name ?
                      (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-bold opacity-70">{formatDate(item.task_dueDate)} · Todo List</p>
                          <span className="text-base font-bold">{item.task_name}</span>
                          <p className="text-sm">{item.task_desc}</p>
                        </div>
                      )
                      :
                      (
                        <div className="flex flex-col gap-1 w-full">
                          <p className="text-xs font-bold opacity-70">{formatDate(item.meet_startDate)} · Schedule</p>
                          <span className="text-base font-bold">{item.meet_name}</span>
                          <p className="text-sm">Meeting Start at: {item.meet_startTime} - {item.meet_endTime}</p>
                        </div>
                      )
                    }
                  </div>
                </li>
              ))
            ) : (
              <div className='py-1 px-2'>
                <div className="divider"><p className="text-sm">No new notifications!</p></div>
              </div>
            )}
          </div>

          <input type="radio" name="my_tabs" id="tab2" role="tab" className="tab" aria-label="Todo" checked={selectedTab === 'Todo'} onChange={() => handleTabChange('Todo')} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-4">
            {todoNotifications.length > 0 ? (
              todoNotifications.map((item) => (
                <li key={item.task_id || item.id}>
                  <div className='pl-2'>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold opacity-70">{formatDate(item.task_dueDate)} · Todo List</p>
                      <span className="text-base font-bold">{item.task_name}</span>
                      <p className="text-sm">{item.task_desc}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className='py-1 px-2'>
                <div className="divider"><p className="text-sm">No new notifications!</p></div>
              </div>
            )}
          </div>

          <input type="radio" name="my_tabs" id="tab3" role="tab" className="tab" aria-label="Schedule" checked={selectedTab === 'Schedule'} onChange={() => handleTabChange('Schedule')} />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-4">
            {scheduleNotifications.length > 0 ? (
              scheduleNotifications.map((item) => (
                <li key={item.meet_id}>
                  <div className='pl-2'>
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-xs font-bold opacity-70">{formatDate(item.meet_startDate)} · Schedule</p>
                      <span className="text-base font-bold">{item.meet_name}</span>
                      <p className="text-sm">Meeting Start at: {item.meet_startTime} - {item.meet_endTime}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className='py-1 px-2'>
                <div className="divider"><p className="text-sm">No new notifications!</p></div>
              </div>
            )}
          </div>
        </div>

      </ul>
    </div>
  );
}

export default Notification;