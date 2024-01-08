import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import {
    format, //Return the formatted date string in the given format. The result may vary by locale.
    isSameDay, //Are the given dates in the same day (and year and month)?
    parseISO, //Parse the given string in ISO 8601 format and return an instance of Date.
    startOfToday, //Return the start of today.
} from 'date-fns'

import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen } from 'lucide-react';

// Utility function to concatenate CSS class details conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Calendar component
export default function Journals() {
    const [journals, setJournals] = useState([])

    useEffect(() => {
        const savedJournals = JSON.parse(localStorage.getItem('journals')) || [];
        setJournals(savedJournals)
    }, [])

    // Initial setup using React state
    const today = startOfToday()

    // Filter journals for the selected day
    const selectedDayJournals = journals.filter((journal) =>
        isSameDay(parseISO(journal.startDate), today)
    )

    // State to manage the input for a new journal
    const [newJournalInput, setNewJournalInput] = useState('');
    const [dailyMood, setDailyMood] = useState('');

    // Function to add a new journal
    const addJournal = () => {
        if (newJournalInput.trim() !== '') {
            const newJournal = {
                id: journals.length + 1, // Generate a unique ID (you may need a more robust solution in a real app)
                detail: newJournalInput,
                mood: dailyMood,
                startDate: today.toISOString(), // Use the selected day
            };

            // Update the journals array with the new journal
            setJournals([...journals, newJournal]);

            // Clear the input field
            setNewJournalInput('');
            setDailyMood('');

            // Save the journals array to local storage
            localStorage.setItem('journals', JSON.stringify([...journals, newJournal]));
        }
    }

    // Function to delete a journal
    const deleteJournal = (journalId) => {
        const updatedJournals = journals.filter((journal) => journal.id !== journalId);
        setJournals(updatedJournals);

        // Save the journals array to local storage
        localStorage.setItem('journals', JSON.stringify(updatedJournals));
    }

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingJournalId, setEditingJournalId] = useState(null);

    // Function to handle the "Edit" button click
    const editJournal = (journalId) => {
        const journalToEdit = journals.find((journal) => journal.id === journalId);

        // Populate the form fields with the data of the selected journal
        setNewJournalInput(journalToEdit.detail);
        setDailyMood(journalToEdit.mood);

        // Set edit mode and the journal being edited
        setIsEditMode(true);
        setEditingJournalId(journalId);
    }

    // Function to handle the "Update" button click
    const updateJournal = () => {
        if (newJournalInput.trim() !== '') {
            const updatedJournals = journals.map((journal) =>
                journal.id === editingJournalId
                    ? {
                        ...journal,
                        detail: newJournalInput,
                        mood: dailyMood,
                    }
                    : journal
            );

            // Update the journals array with the updated journal
            setJournals(updatedJournals);

            // Clear the input fields and exit edit mode
            setNewJournalInput('');
            setDailyMood('');
            setIsEditMode(false);
            setEditingJournalId(null);

            // Save the journals array to local storage
            localStorage.setItem('journals', JSON.stringify(updatedJournals));
        }
    }

    // JSX structure for the calendar
    return (
        <div className="flex">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={false} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={true} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={true} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4">
                <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                        <section className="mt-12 md:mt-0 md:pl-14">
                            <h2 className="font-semibold text-gray-900">
                                Daily Journal for{' '}
                                <time>
                                    {format(today, 'MMM dd, yyy')}
                                </time>
                            </h2>
                            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                                <div className="flex flex-col mb-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder='Today I feel...'
                                        className='input input-bordered input-primary w-full'
                                        value={dailyMood}
                                        onChange={(e) => setDailyMood(e.target.value)}
                                    />

                                    <textarea
                                        type="text"
                                        placeholder='Describe a journal'
                                        className='textarea textarea-primary w-full'
                                        value={newJournalInput}
                                        onChange={(e) => setNewJournalInput(e.target.value)}
                                    />

                                    {isEditMode ? (
                                        <button
                                            type="button"
                                            onClick={updateJournal}
                                            className="btn btn-neutral"
                                        >
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={addJournal}
                                            className="btn btn-neutral"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>


                                {selectedDayJournals.length > 0 ? (
                                    selectedDayJournals.map((journal) => (
                                        <Journal
                                            journal={journal}
                                            key={journal.id}
                                            onDelete={deleteJournal}
                                            onEdit={editJournal}
                                        />
                                    ))
                                ) : (
                                    <p>No journals for today.</p>
                                )}
                            </ol>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Journal component
const Journal = ({ journal, onDelete, onEdit }) => {
    // JSX structure for a journal item
    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            <div className="flex-auto">
                <p className="text-gray-900">Today's Mood: {journal.mood}</p>
                <p className="text-gray-900">Thought: {journal.detail}</p>
                <p className="text-gray-500 text-sm">
                    Date: {format(parseISO(journal.startDate), 'dd/MM/yyy')}
                </p>
            </div>

            <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900 w-full text-left' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left'
                                        )}
                                        onClick={() => onEdit(journal.id)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900 w-full text-left' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left'
                                        )}
                                        onClick={() => onDelete(journal.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    )
}