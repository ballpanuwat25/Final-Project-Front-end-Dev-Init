import React, { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen, ChevronDown, ChevronUp } from 'lucide-react';

import Calendar from '../components/Calendar';
import { formatDate } from '../utils/dateUtils';

import { startOfToday } from 'date-fns';

export default function Todo() {
    const [tasks, setTasks] = useState([]);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    const [columns, setColumns] = useState(['todo', 'in-progress', 'done']);

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
            taskDueDate: selectedDayFromCalendar ? selectedDayFromCalendar : startOfToday(),
            taskPriority: taskPriority,
        }];

        setTasks(updatedTasks);
        setTaskName('');
        setTaskDescription('');
        setTaskStatus('');
        setTaskPriority('');

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

    const [selectedDayFromCalendar, setSelectedDayFromCalendar] = useState(null);

    const handleSelectedDayChange = (day) => {
        setSelectedDayFromCalendar(day);
    };

    const handleOptionChange = (value) => {
        setTaskPriority(value);
    };

    return (
        <div className="flex">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={false} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={true} alert={true} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4 overflow-scroll">
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-xl font-bold'>My Tasks</h1>

                    <button className="btn btn-neutral btn-sm" onClick={() => document.getElementById('add_tasks').showModal()}>+ Add Tasks</button>
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

                                <button className='btn btn-neutral' onClick={addTask}>Add Task</button>
                            </div>

                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                <div className="divider my-2" />

                <div className='flex flex-row gap-4'>
                    {columns.map((column) => (
                        <div key={column} className="bg-red-400 h-full w-72 rounded">
                            <h2 className="text-lg font-bold">{column}</h2>

                            <div className="divider my-2" />

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
                                                    value={editingTask.taskPriority}
                                                    onChange={(e) => setEditingTask({ ...editingTask, taskPriority: e.target.value })}
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
                                                <input type="checkbox" className="checkbox" />
                                                {task.taskName} | {task.taskDescription} | {task.taskPriority} | {formatDate(task.taskDueDate)}
                                                <button onClick={() => startEditing(task.taskId)}>Edit</button>
                                                <button onClick={() => deleteTask(task.taskId)}>Delete</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
        setDropdownOpen(false);
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
                    <div className="rounded-md bg-white border border-gray-200 dark:border-dark-5">
                        <div className="py-1">
                            <label className="flex items-center px-4 py-2 cursor-pointer">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    value="low"
                                    checked={selectedOption === 'low'}
                                    onChange={() => {
                                        handleOptionChange('low')
                                        onSelectOptionChange('low')
                                    }}
                                />
                                <span className="ml-2 text-sm">Low</span>
                            </label>
                            <label className="flex items-center px-4 py-2 cursor-pointer">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    value="medium"
                                    checked={selectedOption === 'medium'}
                                    onChange={() => {
                                        handleOptionChange('medium')
                                        onSelectOptionChange('medium')
                                    }}
                                />
                                <span className="ml-2 text-sm">Medium</span>
                            </label>
                            <label className="flex items-center px-4 py-2 cursor-pointer">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    value="high"
                                    checked={selectedOption === 'high'}
                                    onChange={() => {
                                        handleOptionChange('high')
                                        onSelectOptionChange('high')
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