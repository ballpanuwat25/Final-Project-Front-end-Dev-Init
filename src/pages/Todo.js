import React, { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import {
    LayoutDashboard,
    ListTodo,
    CalendarCheck,
    NotebookPen,
    ChevronDown, ChevronUp,
    ChevronsDown, ChevronsRight, ChevronsUp,
    Pencil, Trash, Plus, Clock4
} from 'lucide-react';

import Calendar from '../components/Calendar';
import { formatDate } from '../utils/dateUtils';

import { startOfToday } from 'date-fns';

export default function Todo() {
    const [tasks, setTasks] = useState([]);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskPriority, setTaskPriority] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const savedNotification = JSON.parse(localStorage.getItem('notification'));
        setNotification(savedNotification);
    }, []);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    const addTask = () => {
        const updatedTasks = [...tasks,
        {
            taskId: Date.now(),
            taskName: taskName,
            taskDescription: taskDescription,
            taskStatus: "Uncompleted",
            taskDueDate: selectedDayFromCalendar ? selectedDayFromCalendar : startOfToday(),
            taskPriority: taskPriority,
        }];

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskPriority('');

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [editingTaskName, setEditingTaskName] = useState('');
    const [editingTaskDescription, setEditingTaskDescription] = useState('');

    const editTask = (taskId) => {
        const task = tasks.find((task) => task.taskId === taskId);
        setSelectedTaskId(taskId);
        setEditingTaskName(task.taskName);
        setEditingTaskDescription(task.taskDescription);
        setTaskStatus(task.taskStatus);
        setTaskPriority(task.taskPriority);

        document.getElementById('edit_tasks').showModal();
    };

    const updateTask = () => {
        const updatedTasks = tasks.map((task) =>
            task.taskId === selectedTaskId
                ? {
                    ...task,
                    taskName: editingTaskName,
                    taskDescription: editingTaskDescription,
                    taskStatus,
                    taskDueDate: selectedDayFromCalendar ? selectedDayFromCalendar : startOfToday(),
                    taskPriority,
                }
                : task
        );

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskStatus('');
        setTaskPriority('');
        setSelectedTaskId(null);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        document.getElementById('edit_tasks').close();
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.taskId !== taskId);
        setTasks(updatedTasks);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
            (task) =>
                task.taskName.toLowerCase().includes(searchTerm) ||
                task.taskDescription.toLowerCase().includes(searchTerm)
        );

        setFilteredTasks(filtered);
    };

    const taskCompleted = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.taskId === taskId) {
                task.taskStatus = task.taskStatus === "Completed" ? "Uncompleted" : "Completed";
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
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={notification} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={true} alert={false} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4 overflow-scroll">
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-lg md:text-3xl font-bold'>My Tasks 🎯</h1>

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
                                    placeholder="Enter a task desc"
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
                                    <tr key={(task.taskId)}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-neutral checkbox-sm mr-2"
                                                checked={task.taskStatus === "Completed"}
                                                onClick={() => taskCompleted(task.taskId)}
                                            />
                                        </td>

                                        <td>{task.taskName}</td>
                                        <td>{task.taskDescription}</td>
                                        <td className={checkStatusClass(task.taskStatus)}>{task.taskStatus}</td>
                                        <td>
                                            <div className='flex items-center gap-2'>
                                                <Clock4 size={16} />
                                                {formatDate(task.taskDueDate)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`${checkPriorityClass(task.taskPriority)} flex justify-center items-center pr-1`}>{task.taskPriority} {checkPriorityIcon(task.taskPriority)} </div>
                                        </td>

                                        <td className='flex gap-2'>
                                            <button className="btn btn-sm btn-neutral " onClick={() => editTask(task.taskId)}>
                                                <Pencil size={16} /> Edit
                                            </button>

                                            <button className="btn btn-sm btn-neutral btn-outline" onClick={() => deleteTask(task.taskId)}>
                                                <Trash size={16} /> Delete
                                            </button>
                                        </td>

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

const SelectOption = ({ onSelectOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        onSelectOptionChange(value);
    };


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="relative inline-block text-left w-full">
            <button
                type="button"
                className="inline-flex justify-between w-full btn btn-outline btn-primary px-4 py-2 text-sm leading-5 font-medium"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={toggleDropdown}
            >
                {selectedOption || 'Select Priority'}
                {dropdownOpen ? (
                    <ChevronUp className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                ) : (
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                )}
            </button>

            {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                    <div className="rounded-md bg-base-100 border border-gray-200 dark:border-dark-5">
                        <div className="py-1">
                            <label className="flex items-center px-4 py-2 cursor-pointer hover:bg-base-300">
                                <input
                                    type="radio"
                                    className="hidden"
                                    value="Low"
                                    checked={selectedOption === 'Low'}
                                    onChange={() => {
                                        handleOptionChange('Low')
                                        onSelectOptionChange('Low')
                                    }}
                                />
                                <span className="ml-2 text-sm">Low</span>
                            </label>
                            <label className="flex items-center px-4 py-2 cursor-pointer hover:bg-base-300">
                                <input
                                    type="radio"
                                    className="hidden"
                                    value="Medium"
                                    checked={selectedOption === 'Medium'}
                                    onChange={() => {
                                        handleOptionChange('Medium')
                                        onSelectOptionChange('Medium')
                                    }}
                                />
                                <span className="ml-2 text-sm">Medium</span>
                            </label>
                            <label className="flex items-center px-4 py-2 cursor-pointer hover:bg-base-300">
                                <input
                                    type="radio"
                                    className="hidden"
                                    value="High"
                                    checked={selectedOption === 'High'}
                                    onChange={() => {
                                        handleOptionChange('High')
                                        onSelectOptionChange('High')
                                    }}
                                />
                                <span className="ml-2 text-sm">High</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};