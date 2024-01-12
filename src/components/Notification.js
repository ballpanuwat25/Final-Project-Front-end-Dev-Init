import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { isToday, differenceInDays } from 'date-fns';

function Notification() {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];

    const approachingTasks = savedTasks.filter(task => differenceInDays(new Date(task.taskDueDate), new Date()) <= 3);
    const approachingMeetings = savedMeetings.filter(meeting => isToday(new Date(meeting.startDate)));

    const combinedApproaching = [...approachingTasks, ...approachingMeetings];

    if (combinedApproaching.length > 0) {
      setNotification(combinedApproaching);
      localStorage.setItem('notification', JSON.stringify(true));
    } else {
      localStorage.setItem('notification', JSON.stringify(false));
    }
  };

  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-circle btn-primary">
        <Bell size={16} />
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {notification.length > 0 ? (
          notification.map((item) => (
            <li key={item.taskId || item.id}>
              <a href='/'>
                {item.taskName ? `${item.taskName} | ${item.taskDescription} | ${item.taskPriority} | ${item.taskDueDate}` : `${item.name} | ${item.startTime} - ${item.endTime}`}
              </a>
            </li>
          ))
        ) : (
          <>
            <li className="text-sm">No tasks or meetings for today!</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Notification;