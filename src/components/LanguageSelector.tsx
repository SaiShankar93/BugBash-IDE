'use client';
import React, { useEffect, useState } from 'react';
import { LANGUAGE_VERSIONS } from '@/constants/languages';

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const languages = Object.entries(LANGUAGE_VERSIONS);

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="text-white bg-gray-800 hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        type="button"
      >
        {language}
        <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div id="dropdown" className="z-10 absolute bg-gray-800 divide-y divide-gray-700 rounded-lg shadow w-44">
          <ul className="py-2 text-sm text-gray-300" aria-labelledby="dropdownDefaultButton">
            {languages.map(([language, version]) => (
              <li key={language}>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700" 
                  onClick={() => { onSelect(language); toggleDropdown(); }}>
                  {language} <span className="text-xs text-gray-400">({version})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
