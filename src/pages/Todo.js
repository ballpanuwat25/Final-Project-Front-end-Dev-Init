import React, { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen } from 'lucide-react';

import Calendar from '../components/Calendar';

const Todo = () => {
    const [tasks, setTasks] = useState([]);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskCategory, setTaskCategory] = useState('');

    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        // Load tasks from local storage on component mount
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    const addTask = () => {
        const updatedTasks = [...tasks,
        {
            taskId: Date.now(),
            taskName: taskName,
            taskDescription: taskDescription,
            taskStatus: taskStatus,
            taskDueDate: selectedDayFromCalendar,
            taskCategory: taskCategory
        }];

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskStatus('');
        setTaskCategory('');

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.taskId !== taskId);
        setTasks(updatedTasks);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const startEditing = (taskId) => {
        const taskToEdit = tasks.find((task) => task.taskId === taskId);
        setEditingTask(taskToEdit);
    };

    const finishEditing = () => {
        const updatedTasks = tasks.map((task) =>
            task.taskId === editingTask.taskId ? editingTask : task
        );

        setTasks(updatedTasks);
        setEditingTask(null);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = '' + d.getFullYear()

        if (month.length < 2)
            month = '0' + month
        if (day.length < 2)
            day = '0' + day

        return [day, month, year].join('/')
    }

    const [selectedDayFromCalendar, setSelectedDayFromCalendar] = useState(null);

    const handleSelectedDayChange = (day) => {
        setSelectedDayFromCalendar(day);
    };

    return (
        <div className="flex">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={false} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={true} alert={true} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4">
                <h1 className='text-xl font-bold'>My Tasks</h1>

                <div className="divider my-2" />

                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Enter a task name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <input
                        type="text"
                        placeholder="Enter a task desc"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <input
                        type="text"
                        placeholder="Enter a task cate"
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <Calendar onSelectedDayChange={handleSelectedDayChange} />

                    <button className='btn btn-neutral' onClick={addTask}>Add Task</button>
                </div>

                <ul>
                    {tasks.map((task) => (
                        <li key={task.taskId}>
                            {editingTask && editingTask.taskId === task.taskId ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTask.taskName}
                                        onChange={(e) => setEditingTask({ ...editingTask, taskName: e.target.value })}
                                    /> <br />

                                    <input
                                        type="text"
                                        value={editingTask.taskDescription}
                                        onChange={(e) => setEditingTask({ ...editingTask, taskDescription: e.target.value })}
                                    /> <br />

                                    <input
                                        type="text"
                                        value={editingTask.taskCategory}
                                        onChange={(e) => setEditingTask({ ...editingTask, taskCategory: e.target.value })}
                                    /> <br />

                                    <input
                                        type="date"
                                        value={editingTask.taskDueDate}
                                        onChange={(e) => setEditingTask({ ...editingTask, taskDueDate: e.target.value })}
                                    /> <br />

                                    <button onClick={finishEditing}>Save</button>
                                </>
                            ) : (
                                <>
                                    {task.taskName} | {task.taskDescription} | {task.taskCategory} | {formatDate(task.taskDueDate)}
                                    <button onClick={() => startEditing(task.taskId)}>Edit</button>
                                    <button onClick={() => deleteTask(task.taskId)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Todo;
