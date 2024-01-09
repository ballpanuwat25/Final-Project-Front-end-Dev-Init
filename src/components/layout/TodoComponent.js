import React, { useState, useEffect } from "react";
import { formatDate } from "../../utils/dateUtils";

import { isToday } from 'date-fns';

function TodoComponent() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const todayTasks = savedTasks.filter(task => isToday(new Date(task.taskDueDate)));
        setTasks(todayTasks);
    }, []);

    const taskCompleted = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.taskId === taskId) {
                task.taskStatus = task.taskStatus === "completed" ? "uncompleted" : "completed";
            }
            return task;
        });

        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="h-full flex flex-col p-2 gap-2 lg:p-4 lg:gap-4">
                <h1 className="font-bold text-2xl">To-Do in Today!</h1>
                <div className="w-full h-full flex flex-col gap-2">
                    {tasks.map((task) => (
                        <div key={task.taskId}>
                            <button
                                className="btn btn-neutral w-full inline-flex justify-start items-center"
                                onClick={() => taskCompleted(task.taskId)}
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-secondary checkbox-sm mr-2"
                                    checked={task.taskStatus === "completed"}
                                />
                                {task.taskName} | {task.taskDescription} | {task.taskPriority} | {formatDate(task.taskDueDate)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TodoComponent;