import React, { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import {
    LayoutDashboard,
    ListTodo,
    CalendarCheck,
    NotebookPen,
    Presentation,
    ChevronsDown, ChevronsRight, ChevronsUp,
    Pencil, Trash, Plus, Clock4
} from 'lucide-react';

import Calendar from '../components/Calendar';
import SelectOption from '../components/SelectOption';
import Notification from '../components/Notification';

import { formatDate } from '../utils/dateUtils';

import { startOfToday } from 'date-fns';

export default function Todo() {
    const [tasks, setTasks] = useState([]);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);

    const [notificationStatus, setNotificationStatus] = useState(null);

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [editingTaskName, setEditingTaskName] = useState('');
    const [editingTaskDescription, setEditingTaskDescription] = useState('');

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);

        const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
        setNotificationStatus(savedNotification);
    }, []);

    const addTask = () => {
        const updatedTasks = [...tasks,
        {
            task_id: Date.now(),
            task_name: taskName,
            task_desc: taskDescription,
            task_status: "Uncompleted",
            task_dueDate: selectedDayFromCalendar ? selectedDayFromCalendar : startOfToday(),
            task_priority: taskPriority,
            task_readStatus: "Unread",
        }];

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskPriority('');

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        window.location.reload();
    };

    const editTask = (taskId) => {
        const task = tasks.find((task) => task.task_id === taskId);
        setSelectedTaskId(taskId);
        setEditingTaskName(task.task_name);
        setEditingTaskDescription(task.task_desc);
        setTaskPriority(task.task_priority);

        document.getElementById('edit_tasks').showModal();
    };

    const updateTask = () => {
        const updatedTasks = tasks.map((task) =>
            task.task_id === selectedTaskId
                ? {
                    ...task,
                    task_name: editingTaskName,
                    task_desc: editingTaskDescription,
                    task_dueDate: selectedDayFromCalendar ? selectedDayFromCalendar : startOfToday(),
                    task_priority: taskPriority,
                }
                : task
        );

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskPriority('');
        setSelectedTaskId(null);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        document.getElementById('edit_tasks').close();

        window.location.reload();
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
        setTasks(updatedTasks);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        window.location.reload();
    };

    const [selectedDayFromCalendar, setSelectedDayFromCalendar] = useState(null);

    const handleSelectedDayChange = (day) => {
        setSelectedDayFromCalendar(day);
    };

    const handleOptionChange = (value) => {
        setTaskPriority(value);
    };

    const handleSearchInputChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchInput(searchTerm);

        const filtered = tasks.filter(
            (task) => task.task_name.toLowerCase().includes(searchTerm)
        );

        setFilteredTasks(filtered);
    };

    const taskCompleted = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.task_id === taskId) {
                task.task_status = task.task_status === "Completed" ? "Uncompleted" : "Completed";
                task.task_readStatus = task.task_readStatus === "Read" ? "Unread" : "Read";
            }
            return task;
        });

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    const checkPriorityClass = (priority) => {
        if (priority === 'Low') {
            return 'badge badge-success badge-outline';
        } else if (priority === 'Medium') {
            return 'badge badge-warning badge-outline';
        } else if (priority === 'High') {
            return 'badge badge-error badge-outline';
        }
    };

    const checkPriorityIcon = (priority) => {
        if (priority === 'Low') {
            return <ChevronsDown size={20} />;
        } else if (priority === 'Medium') {
            return <ChevronsRight size={20} />;
        } else if (priority === 'High') {
            return <ChevronsUp size={20} />;
        }
    };

    const checkStatusClass = (status) => {
        if (status === 'Completed') {
            return 'font-bold text-success';
        } else {
            return 'font-bold text-error';
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={notificationStatus} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={true} alert={false} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
                <SidebarItem icon={<Presentation size={20} />} text="Kanban" active={false} alert={false} path={"/kanban"} />
            </Sidebar>

            <div className="flex-1 p-4 overflow-scroll">
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-lg md:text-3xl font-bold'>My Tasks 🎯</h1>

                    <div className='hidden'>
                        <Notification />
                    </div>

                    <button className="btn btn-neutral btn-sm" onClick={() => document.getElementById('add_tasks').showModal()}><Plus size={16} /> Add Tasks</button>

                    <dialog id="add_tasks" className="modal">
                        <div className="modal-box">

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
                                    placeholder="Enter a task description"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    className="input input-bordered input-primary w-full"
                                />

                                <div className='flex w-full gap-2'>
                                    <SelectOption onSelectOptionChange={handleOptionChange} />

                                    <Calendar onSelectedDayChange={handleSelectedDayChange} />
                                </div>
                            </div>

                            <div className="modal-action">
                                <form method="dialog" className='flex w-full gap-2'>
                                    <div className='w-full'>
                                        <button className='w-full btn btn-neutral' onClick={addTask}>Add Task</button>
                                    </div>
                                    <div className='w-full'>
                                        <button className="w-full btn">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                <div className="divider my-2" />

                <div className='flex flex-col gap-4'>
                    <input
                        type="text"
                        placeholder="Search tasks"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        className="input input-bordered border-2 input-primary w-full"
                    />

                    <div className="w-full">
                        <table className='table w-full'>
                            <thead>
                                <tr className='text-base'>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Priority</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {(searchInput ? filteredTasks : tasks).map((task) => (
                                    <tr key={(task.task_id)}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-neutral checkbox-sm mr-2"
                                                checked={task.task_status === "Completed"}
                                                onChange={() => taskCompleted(task.task_id)}
                                            />
                                        </td>

                                        <td>{task.task_name}</td>
                                        <td>{task.task_desc}</td>
                                        <td className={checkStatusClass(task.task_status)}>{task.task_status}</td>
                                        <td>
                                            <div className='flex items-center gap-2'>
                                                <Clock4 size={16} />
                                                {formatDate(task.task_dueDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`${checkPriorityClass(task.task_priority)} flex justify-center items-center pr-1`}>{task.task_priority} {checkPriorityIcon(task.task_priority)} </div>
                                        </td>

                                        <td className='flex gap-2'>
                                            <button className="btn btn-sm btn-neutral " onClick={() => editTask(task.task_id)}>
                                                <Pencil size={16} /> Edit
                                            </button>

                                            <dialog id="edit_tasks" className="modal">
                                                <div className="modal-box">
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter a task name"
                                                            value={editingTaskName}
                                                            onChange={(e) => setEditingTaskName(e.target.value)}
                                                            className="input input-bordered input-primary w-full"
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="Enter a task desc"
                                                            value={editingTaskDescription}
                                                            onChange={(e) => setEditingTaskDescription(e.target.value)}
                                                            className="input input-bordered input-primary w-full"
                                                        />

                                                        <div className='flex w-full gap-2'>
                                                            <SelectOption onSelectOptionChange={handleOptionChange} />

                                                            <Calendar onSelectedDayChange={handleSelectedDayChange} />
                                                        </div>
                                                    </div>

                                                    <div className="modal-action">
                                                        <form method="dialog" className='flex w-full gap-2'>
                                                            <div className='w-full'>
                                                                <button className='btn btn-neutral w-full' onClick={updateTask}>Save</button>
                                                            </div>
                                                            <div className='w-full'>
                                                                <button className="btn w-full">Close</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>

                                            <button className="btn btn-sm btn-neutral btn-outline" onClick={() => deleteTask(task.task_id)}>
                                                <Trash size={16} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};