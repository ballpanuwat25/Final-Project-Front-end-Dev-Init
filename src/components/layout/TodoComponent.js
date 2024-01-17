import React, { useState, useEffect } from 'react';
import { isToday, isThisMonth, differenceInDays, startOfToday } from 'date-fns';
import SelectOption from '../SelectOption';
import { Plus, ChevronsDown, ChevronsUp, ChevronsRight } from 'lucide-react';

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
        const overdueTasks = todoList.filter(task => differenceInDays(new Date(task.task_dueDate), new Date()) < 0
            && isThisMonth(new Date(task.task_dueDate)));
        const completedTasks = overdueTasks.filter(task => task.task_status === 'Completed');
        return { completed: completedTasks.length, total: overdueTasks.length };
    };

    const calculateProgress = ({ completed, total }) => {
        const progressPercentage = total === 0 ? 0 : (completed / total) * 100;
        return progressPercentage.toFixed(2);
    };

    const todayTasks = getTodayTasksCount();
    const monthlyTasks = getMonthlyTasksCount();
    const overdueTasks = getOverdueTasksCount();

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 justify-between items-center'>
            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Task Today</h2>
                <div className='flex justify-between mt-7 mb-0'>
                    <div>{`${todayTasks.completed}/${todayTasks.total}`} Task</div>
                    <div>{calculateProgress(todayTasks)} %</div>
                </div>
                <progress className="progress progress-primary w-full" value={calculateProgress(todayTasks)} max="100"></progress>
            </div>

            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Task Monthly</h2>
                <div className='flex justify-between mt-7 mb-0'>
                    <div>{`${monthlyTasks.completed}/${monthlyTasks.total}`} Task</div>
                    <div>{calculateProgress(monthlyTasks)} %</div>
                </div>
                <progress className="progress progress-secondary w-full" value={calculateProgress(monthlyTasks)} max="100"></progress>
            </div>

            <div className='border shadow w-full rounded-lg p-4'>
                <h2 className="text-2xl font-bold">Overdue Task</h2>
                <div className='flex justify-between mt-7 mb-0'>
                    <div>{`${overdueTasks.completed}/${overdueTasks.total}`} Task</div>
                    <div>{calculateProgress(overdueTasks)} %</div>
                </div>
                <progress className="progress progress-accent w-full" value={calculateProgress(overdueTasks)} max="100"></progress>
            </div>
        </div>
    );
}

export default TodoComponent;

export function TaskTodayComponent() {
    const [tasks, setTasks] = useState([]);

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    const getTodayTasks = () => {
        return tasks.filter(task => isToday(new Date(task.task_dueDate)));
    };

    const addTask = () => {
        const updatedTasks = [...tasks,
        {
            task_id: Date.now(),
            task_name: taskName,
            task_desc: taskDescription,
            task_status: "Uncompleted",
            task_dueDate: startOfToday(),
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
        window.location.reload();
    };

    const handleOptionChange = (value) => {
        setTaskPriority(value);
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

    const checkPriorityClass = (priority) => {
        if (priority === 'Low') {
            return 'badge badge-success badge-outline';
        } else if (priority === 'Medium') {
            return 'badge badge-warning badge-outline';
        } else if (priority === 'High') {
            return 'badge badge-error badge-outline';
        }
    };

    return (
        <div className='w-full border shadow rounded-lg h-52 md:h-96 p-4 overflow-y-scroll'>
            <div className='flex flex-row gap-3'>
                <input type="text" placeholder="Search..." className="input input-bordered w-full" value={searchInput} onChange={handleSearchInputChange} />

                <button className="btn btn-neutral" onClick={() => document.getElementById('add_tasks').showModal()}><Plus size={16} /> Add Tasks</button>

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

            <div className="flex flex-col gap-3 rounded-lg">
                {(searchInput ? filteredTasks : getTodayTasks()).map((task, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <button className="flex items-center justify-between w-full gap-2 btn border-2 shadow" onClick={() => taskCompleted(task.task_id)}>
                            <div className='flex items-center gap-2'>
                                <input type="checkbox" className="checkbox" checked={task.task_status === "Completed"} onClick={() => taskCompleted(task.task_id)} />
                                <p className="ml-2 text-base">{task.task_name}</p>
                            </div>

                            <div className={`${checkPriorityClass(task.task_priority)}`}>{checkPriorityIcon(task.task_priority)}</div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}