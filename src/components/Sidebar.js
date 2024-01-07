import { ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link } from 'react-router-dom';
import ThemeController from "./ThemeController";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <h1 className={`text-primary font-bold ${expanded ? "w-full" : "hidden"
                        }`}>
                        PMI Web Applicaion
                    </h1>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-primary text-primary-content"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <div className="flex-1 px-3">{children}</div>
                </SidebarContext.Provider>

                <div className="border-t flex p-3 w-full">
                    <ThemeController expanded={expanded} />
                </div>
            </nav>
        </aside>
    )
}

export function SidebarItem({ icon, text, active, alert, path }) {
    const { expanded } = useContext(SidebarContext)

    return (
        <Link to={path}
            className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
                    ? "bg-neutral text-neutral-content"
                    : "hover:bg-base-300"
                }
    `}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-accent ${expanded ? "" : "top-2"}`}
                />
            )}

            {!expanded && (
                <div
                    className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-neutral text-neutral-content text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
                >
                    {text}
                </div>
            )}
        </Link>
    )
}