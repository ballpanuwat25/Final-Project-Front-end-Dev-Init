import React, { useState, useEffect } from 'react';
import { Palette, ChevronDown } from "lucide-react";

function ThemeController({ expanded }) {

    const [selectedTheme, setSelectedTheme] = useState(() => {

        return localStorage.getItem('selectedTheme') || 'light';
    });

    const handleThemeChange = (theme) => {
        localStorage.setItem('selectedTheme', theme);
        setSelectedTheme(theme);

        document.body.className = `theme-${theme}`;
    };

    useEffect(() => {
        document.body.className = `theme-${selectedTheme}`;
    }, [selectedTheme]);

    return (
        <>
            <div className="dropdown dropdown-top w-full">
                <div tabIndex={0} role="button" className="relative flex items-center p-2 my-1
                            font-medium rounded-md cursor-pointer btn">
                    {expanded ? (
                        <div className="flex items-center justify-left w-full">
                            <Palette />
                            <div className="flex gap-1 items-center">
                                <span className="ml-2">Theme</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    ) : (
                        <Palette />
                    )}
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Light"
                            value="light"
                            checked={selectedTheme === 'light'}
                            onChange={() => handleThemeChange('light')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Dark"
                            value="dark"
                            checked={selectedTheme === 'dark'}
                            onChange={() => handleThemeChange('dark')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Lemonade"
                            value="lemonade"
                            checked={selectedTheme === 'lemonade'}
                            onChange={() => handleThemeChange('lemonade')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Nord"
                            value="nord"
                            checked={selectedTheme === 'nord'}
                            onChange={() => handleThemeChange('nord')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Autumn"
                            value="autumn"
                            checked={selectedTheme === 'autumn'}
                            onChange={() => handleThemeChange('autumn')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Pastel"
                            value="pastel"
                            checked={selectedTheme === 'pastel'}
                            onChange={() => handleThemeChange('pastel')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Dim"
                            value="dim"
                            checked={selectedTheme === 'dim'}
                            onChange={() => handleThemeChange('dim')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Night"
                            value="night"
                            checked={selectedTheme === 'night'}
                            onChange={() => handleThemeChange('night')}
                        />
                    </li>

                    <li>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label="Coffee"
                            value="coffee"
                            checked={selectedTheme === 'coffee'}
                            onChange={() => handleThemeChange('coffee')}
                        />
                    </li>
                </ul>
            </div>
        </>
    );
}

export default ThemeController;
