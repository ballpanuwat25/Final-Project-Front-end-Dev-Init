import React, { useState, useEffect } from 'react';
import { isToday, isThisMonth, differenceInDays } from 'date-fns';

function TodoComponent() {
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTodoList(savedTasks);
    }, []);

    const getTodayTasksCount = () => {
        const todayTasks = todoList.filter(task => isToday(new Date(task.task_dueDate)));
        const completedTasks = todayTasks.filter(task => task.task_status === 'Completed');
        return { completed: completedTasks.length, total: todayTasks.length };
    };

    const getMonthlyTasksCount = () => {
        const monthlyTasks = todoList.filter(task => isThisMonth(new Date(task.task_dueDate)));
        const completedTasks = monthlyTasks.filter(task => task.task_status === 'Completed');
        return { completed: completedTasks.length, total: monthlyTasks.length };
    };

    const getOverdueTasksCount = () => {
        const overdueTasks = todoList.filter(task => differenceInDays(new Date(task.task_dueDate), new Date()) < 0);
        const completedTasks = overdueTasks.filter(task => task.task_status === 'Completed');
        return { completed: completedTasks.length, total: overdueTasks.length };
    };

    const calculateProgress = ({ completed, total }) => {
        return total === 0 ? 0 : (completed / total) * 100;
    };

    const todayTasks = getTodayTasksCount();
    const monthlyTasks = getMonthlyTasksCount();
    const overdueTasks = getOverdueTasksCount();

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 justify-between items-center'>
            <div className='border shadow w-full h-52 rounded p-2'>
                <h2>Tasks Today</h2>
                <div>{`${todayTasks.completed}/${todayTasks.total}`}</div>
                <progress className="progress progress-primary w-56" value={calculateProgress(todayTasks)} max="100"></progress>
            </div>
            <div className='border shadow w-full h-52 rounded p-2'>
                <h2>Tasks Monthly</h2>
                <div>{`${monthlyTasks.completed}/${monthlyTasks.total}`}</div>
                <progress className="progress progress-primary w-56" value={calculateProgress(monthlyTasks)} max="100"></progress>
            </div>
            <div className='border shadow w-full h-52 rounded p-2'>
                <h2>Overdue Tasks</h2>
                <div>{`${overdueTasks.completed}/${overdueTasks.total}`}</div>
                <progress className="progress progress-primary w-56" value={calculateProgress(overdueTasks)} max="100"></progress>
            </div>
        </div>
    );
}

export default TodoComponent;
