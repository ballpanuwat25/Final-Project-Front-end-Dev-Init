import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { isToday, differenceInDays } from 'date-fns';
import { formatDate } from '../utils/dateUtils';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    getNotificationStatus();
  }, []);

  const getNotificationStatus = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];

    const approachingTasks = savedTasks.filter(task => differenceInDays(new Date(task.task_dueDate), new Date()) < 3);
    const approachingMeetings = savedMeetings.filter(meeting => isToday(new Date(meeting.startDate), new Date()) < 3);

    const combinedApproaching = [...approachingTasks, ...approachingMeetings];

    if (combinedApproaching.length > 0) {
      localStorage.setItem('notificationStatus', JSON.stringify(true));
      setNotifications(combinedApproaching);
    } else {
      localStorage.setItem('notificationStatus', JSON.stringify(false));
    }
  };

  const clearNotification = () => {
    localStorage.setItem('notificationStatus', JSON.stringify(false));
    setNotifications([]);
  };

  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <button>
        <div tabIndex={0} role="button" className="btn btn-sm btn-circle btn-primary">
          <Bell size={16} />
        </div>
        {notifications.length > 0 && (
          <div className="w-2 h-2 bg-accent rounded-full absolute top-0 right-0" />
        )}
      </button>

      <ul tabIndex={0} className="dropdown-content z-[1] top-10 menu p-2 shadow bg-base-100 border rounded-box w-72 xl:w-80 2xl:w-96">
        <div className='flex items-center justify-between py-1 px-2 gap-2'>
          <h1 className='text-lg font-semibold'>Notifications 🔔</h1>

          <button className='underline text-primary' onClick={clearNotification}>Clear all</button>
        </div>

        {notifications.length > 0 ? (
          notifications.map((item) => (
            <li key={item.task_id || item.id}>
              <div className='mt-1 mb-1'>
                {item.task_name ?
                  (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold opacity-50">{formatDate(item.task_dueDate)} · Todo List</p>
                      <span className="text-base text-primary font-bold">{item.task_name}</span>
                      <p className="text-sm">{item.task_description}</p>
                    </div>
                  )
                  :
                  (
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-xs font-bold opacity-50">{formatDate(item.startDate)} · Schedule</p>
                      <span className="text-base text-primary font-bold">{item.name}</span>
                      <p className="text-sm">Meeting Start at: {item.startTime} - {item.endTime}</p>
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
      </ul>
    </div>
  );
}

export default Notification;