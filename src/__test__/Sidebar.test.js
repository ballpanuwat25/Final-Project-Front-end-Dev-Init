import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen, Presentation } from 'lucide-react';


test('renders Sidebar component', () => {
    const { getByText } = render(
        <Router>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={false} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={false} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
                <SidebarItem icon={<Presentation size={20} />} text="Kanban" active={false} alert={false} path={"/kanban"} />
            </Sidebar>
        </Router>
    );

    const createdByText = getByText(/Created by/i);
    expect(createdByText).toBeInTheDocument();

});