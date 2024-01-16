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
            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Task Today</h2>
                <div className='flex justify-between mt-8 mb-0'>
                    <div>{`${todayTasks.completed}/${todayTasks.total}`} Task</div>
                    <div>{calculateProgress(todayTasks)} %</div>
                </div>
                <progress className="progress progress-primary w-full" value={calculateProgress(todayTasks)} max="100"></progress>
            </div>

            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Task Monthly</h2>
                <div className='flex justify-between mt-8 mb-0'>
                    <div>{`${monthlyTasks.completed}/${monthlyTasks.total}`} Task</div>
                    <div>{calculateProgress(monthlyTasks)} %</div>
                </div>
                <progress className="progress progress-secondary w-full" value={calculateProgress(monthlyTasks)} max="100"></progress>
            </div>

            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Overdue Task</h2>
                <div className='flex justify-between mt-8 mb-0'>
                    <div>{`${overdueTasks.completed}/${overdueTasks.total}`} Task</div>
                    <div>{calculateProgress(overdueTasks)} %</div>
                </div>
                <progress className="progress progress-accent w-full" value={calculateProgress(overdueTasks)} max="100"></progress>
            </div>
        </div>
    );
}

export default TodoComponent;
