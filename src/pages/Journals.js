import { useState, useEffect } from 'react'
import {
    format,
    parseISO,
    startOfToday,
} from 'date-fns'

import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen, Pencil, Trash, Save, Check, Plus } from 'lucide-react';

export default function Journals() {
    const [journals, setJournals] = useState([])
    const [newJournalInput, setNewJournalInput] = useState('');
    const [dailyMood, setDailyMood] = useState('');
    const [hightlight, setHightlight] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingJournalId, setEditingJournalId] = useState(null);

    const [notificationStatus, setNotificationStatus] = useState(null);

    useEffect(() => {
        const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
        setNotificationStatus(savedNotification);
    }, []);

    const today = startOfToday()

    useEffect(() => {
        const savedJournals = JSON.parse(localStorage.getItem('journals')) || [];
        setJournals(savedJournals)
    }, [])

    const addJournal = () => {
        if (newJournalInput.trim() !== '') {
            const newJournal = {
                id: journals.length + 1,
                detail: newJournalInput,
                mood: dailyMood,
                hightlight: hightlight,
                startDate: today.toISOString(),
            };

            setJournals([...journals, newJournal]);

            setNewJournalInput('');
            setDailyMood('');
            setHightlight('');

            localStorage.setItem('journals', JSON.stringify([...journals, newJournal]));
        }
    }

    const deleteJournal = (journalId) => {
        const updatedJournals = journals.filter((journal) => journal.id !== journalId);
        setJournals(updatedJournals);

        localStorage.setItem('journals', JSON.stringify(updatedJournals));
    }

    const editJournal = (journalId) => {
        const journalToEdit = journals.find((journal) => journal.id === journalId);

        setNewJournalInput(journalToEdit.detail);
        setDailyMood(journalToEdit.mood);
        setHightlight(journalToEdit.hightlight);

        setIsEditMode(true);
        setEditingJournalId(journalId);
    }

    const updateJournal = () => {
        if (newJournalInput.trim() !== '') {
            const updatedJournals = journals.map((journal) =>
                journal.id === editingJournalId
                    ? {
                        ...journal,
                        detail: newJournalInput,
                        mood: dailyMood,
                        hightlight: hightlight,
                    }
                    : journal
            );

            setJournals(updatedJournals);

            setNewJournalInput('');
            setDailyMood('');
            setHightlight('');
            setIsEditMode(false);
            setEditingJournalId(null);

            localStorage.setItem('journals', JSON.stringify(updatedJournals));
        }
    }

    const filteredJournals = journals.filter((journal) =>
        journal.detail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={notificationStatus} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={true} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4 overflow-scroll">
                <div className="w-full">
                    <div className='w-full flex justify-between items-center'>
                        <h1 className='text-lg md:text-3xl font-bold'> Daily Journal 📝</h1>

                        <button className="btn btn-neutral btn-sm" onClick={() => document.getElementById('daily_journal').showModal()}><Plus size={16} /> Add Journal</button>

                        <dialog id="daily_journal" className="modal">
                            <div className="modal-box">
                                <div className='flex flex-col'>
                                    <h2 className="font-bold text-base text-primary">
                                        <time>
                                            {format(today, 'MMM dd, yyy')}
                                        </time>
                                    </h2>

                                    <div className="flex flex-col my-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder='Today I feel...'
                                            className='input input-bordered input-primary w-full'
                                            value={dailyMood}
                                            onChange={(e) => setDailyMood(e.target.value)}
                                        />

                                        <input
                                            type="text"
                                            placeholder='Highlight of the day!'
                                            className='input input-bordered input-primary w-full'
                                            value={hightlight}
                                            onChange={(e) => setHightlight(e.target.value)}
                                        />

                                        <textarea
                                            type="text"
                                            placeholder='Describe a journal...'
                                            className='textarea textarea-primary w-full'
                                            value={newJournalInput}
                                            rows="7"
                                            onChange={(e) => setNewJournalInput(e.target.value)}
                                        />

                                    </div>
                                </div>
                                <div className="modal-action">
                                    <form method="dialog" className='flex w-full gap-2'>
                                        {isEditMode ? (
                                            <div className='w-full'>
                                                <button
                                                    type="button"
                                                    onClick={updateJournal}
                                                    className="btn btn-neutral w-full"
                                                >
                                                    <Check size={20} /> Update
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='w-full'>
                                                <button
                                                    type="button"
                                                    onClick={addJournal}
                                                    className="btn btn-neutral w-full"
                                                >
                                                    <Save size={20} /> Save
                                                </button>
                                            </div>
                                        )}

                                        <div className='w-full'>
                                            <button className="btn w-full">Close</button>
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
                            placeholder="Search journals"
                            className="input input-bordered input-primary border-2 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className='w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
                            {filteredJournals.length > 0 ? (
                                filteredJournals.map((journal) => (
                                    <Journal
                                        journal={journal}
                                        key={journal.id}
                                        onDelete={deleteJournal}
                                        onEdit={editJournal}
                                    />
                                ))
                            ) : (
                                <p>No matching journals found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Journal = ({ journal, onDelete, onEdit }) => {
    return (
        <div className="flex flex-col p-4 input-outline input h-72 border-2 border-primary">
            <p className="text-sm mb-2 font-bold text-primary">
                📅 {format(parseISO(journal.startDate), 'MMM dd, yyy')}
            </p>

            <div className='overflow-y-scroll mb-4 h-full pr-2'>
                <p className="text-base">
                    <span className='font-semibold'>Today's Mood:</span> {journal.mood}
                </p>

                <div className="divider divider-primary my-0 opacity-40" />

                <p className="text-base">
                    <span className='font-semibold'>Highlight:</span> {journal.hightlight}
                </p>

                <div className="divider divider-primary my-0 opacity-40" />

                <p className="text-base">
                    <span className='font-semibold'>Thoughts:</span> {journal.detail}
                </p>
            </div>

            <div className='flex gap-2 justify-start w-full'>
                <div className="w-full">
                    <button
                        className="btn btn-neutral btn-sm w-full"
                        onClick={() => {
                            onEdit(journal.id)
                            document.getElementById('daily_journal').showModal()
                        }}
                    >
                        <Pencil size={16} /> Edit
                    </button>
                </div>

                <div className="w-full">
                    <button
                        className="btn btn-neutral btn-outline btn-sm w-full"
                        onClick={() => onDelete(journal.id)}
                    >
                        <Trash size={16} /> Delete
                    </button>
                </div>
            </div>

        </div>
    )
}