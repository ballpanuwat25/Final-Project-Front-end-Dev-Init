import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SelectOption ({ onSelectOptionChange }) {
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
                {selectedOption || 'Priority'}
                {dropdownOpen ? (
                    <ChevronUp className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                ) : (
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                )}
            </button>

            {dropdownOpen && (
                <div className="origin-top-right absolute -top-32 mt-2 w-56 rounded-md shadow-lg">
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