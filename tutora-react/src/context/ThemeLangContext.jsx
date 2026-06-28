import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeLangContext = createContext();

export const useThemeLang = () => useContext(ThemeLangContext);

export const ThemeLangProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [language, setLanguage] = useState('en');

    // Initialize theme and language from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedLang = localStorage.getItem('language') || 'en';
        
        setIsDarkTheme(savedTheme === 'dark');
        setLanguage(savedLang);
        
        applyThemeClass(savedTheme);
        applyLanguageAttr(savedLang);
    }, []);

    const applyThemeClass = (themeName) => {
        if (themeName === 'light') {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    };

    const applyLanguageAttr = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    const toggleTheme = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setIsDarkTheme(!isDarkTheme);
        localStorage.setItem('theme', newTheme);
        applyThemeClass(newTheme);
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        applyLanguageAttr(newLang);
    };

    return (
        <ThemeLangContext.Provider value={{ isDarkTheme, toggleTheme, language, toggleLanguage }}>
            {children}
        </ThemeLangContext.Provider>
    );
};
