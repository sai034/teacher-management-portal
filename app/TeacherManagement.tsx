"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Filter, Plus, Edit, Trash2, Eye, Send,
    ChevronDown, X, Menu, User, Book, Home, Settings,
    LogOut, MessageSquare, Calendar, FileText, Users,
    ChevronRight, Lock, Mail, UserPlus, Sun, Moon
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Teacher {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: 'Active' | 'Inactive';
    avatar?: string;
    lastActive?: string;
    joinDate?: string;
    phone?: string;
    department?: string;
    role?: 'Admin' | 'Teacher' | 'Staff';
}

interface FilterOptions {
    subject: string;
    status: string;
    role: string;
}

const loggedInUser = {
    name: 'Admin User',
    email: 'admin@school.edu',
};


const initialTeachers: Teacher[] = [
    {
        id: '1',
        name: 'Vivek',
        email: 'vivek@school.edu',
        subject: 'Mathematics',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        lastActive: '2 hours ago',
        joinDate: '2020-01-15',
        phone: '+91 8978101934',
        department: 'CSE',
        role: 'Admin'
    },

    {
        id: '2',
        name: 'Ramana',
        email: 'ramana@school.edu',
        subject: 'English',
        status: 'Inactive',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        lastActive: '3 days ago',
        joinDate: '2021-03-10',
        phone: '+91 7095991234',
        department: 'Humanities',
        role: 'Teacher'
    },
    {
        id: '3',
        name: 'Prakash',
        email: 'prakash@school.edu',
        subject: 'Science',
        status: 'Active',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        lastActive: '3 hours ago',
        joinDate: '2021-03-10',
        phone: '+91 7799421234',
        department: 'ISE',
        role: 'Teacher'
    },
];

const TeacherManagement: React.FC = () => {
    const toastId = useRef(null);
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<FilterOptions>({ subject: '', status: '', role: '' });
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [isMobileView, setIsMobileView] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
        name: '',
        email: '',
        subject: '',
        status: 'Active',
        phone: '',
        department: '',
        role: 'Teacher',
        lastActive: '',
        avatar: ''
    });
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);
    const [messageContent, setMessageContent] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);


    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };


    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);



    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobileView(mobile);
            if (!mobile) setIsSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const themeClasses = {
        profileText: theme === 'dark' ? 'text-[black] ' : 'text-white',
        wholeSearch: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100',
        bg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
        text: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        sidebar: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        card: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        modal: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        input: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
        header: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        tableHeader: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
        tableRow: theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50',
        tableText: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        tableSubtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        filterButton: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
        filterText: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        statusActive: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
        statusInactive: theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
        roleAdmin: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
        iconColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        iconHover: theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600',
        navItem: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        navItemActive: theme === 'dark' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800',
        navIcon: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        mobileMenuBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        profileDropdown: theme === 'dark' ? 'bg-gray-700' : 'bg-white',
        profileDropdownItem: theme === 'dark' ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700',
        profileDropdownItemDanger: theme === 'dark' ? 'text-red-300 hover:bg-gray-600' : 'text-red-500 hover:bg-gray-100'
    };

    // Navigation items
    const navItems = [
        { name: 'Dashboard', icon: Home },
        { name: 'Teachers', icon: User, active: true },
        { name: 'Students', icon: Users },
        { name: 'Classes', icon: Book },
        { name: 'Schedule', icon: Calendar },
        { name: 'Reports', icon: FileText },
        { name: 'Messages', icon: MessageSquare },
        { name: 'Settings', icon: Settings },
    ];

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof FilterOptions) => {
        setFilters((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({ subject: '', status: '', role: '' });
        setSearchQuery('');
    };


    const handleView = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsViewModalOpen(true);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsEditModalOpen(true);
    };



    const handleDelete = (id: string) => {
        const teacher = teachers.find(t => t.id === id);
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        toast.success(`Deleted ${teacher?.name} successfully`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: theme === 'dark' ? 'dark' : 'light',
        });
    };
    const handleSendMessage = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsSendModalOpen(true);
    };



    // Handle login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginForm.email && loginForm.password) {
            setIsLoggedIn(true);

            setTimeout(() => {
                toast.success('Login Successfull', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }, 0);
        }
    };



    // Handle logout
    const handleLogout = () => {
        // Show toast notification
        toast.success('Logout Successfull', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: theme === 'dark' ? 'dark' : 'light',
        });

        setTimeout(() => {
            setIsLoggedIn(false);
            setIsProfileDropdownOpen(false);
        }, 3000);
    };

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = (teachers.length + 1).toString();
        setTeachers([...teachers, { ...newTeacher, id: newId }]);
        setIsAddTeacherModalOpen(false);
        setNewTeacher({
            name: '',
            email: '',
            subject: '',
            status: 'Active',
            phone: '',
            department: '',
            role: 'Teacher'
        });
        toast.success('Created teacher successfully', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: theme === 'dark' ? 'dark' : 'light',
        });
    };

    const handleViewProfile = () => {
        setIsProfileDropdownOpen(false);
        setIsProfileModalOpen(true);
    };



    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filters.subject ? teacher.subject === filters.subject : true;
        const matchesStatus = filters.status ? teacher.status === filters.status : true;
        const matchesRole = filters.role ? teacher.role === filters.role : true;
        return matchesSearch && matchesSubject && matchesStatus && matchesRole;
    });


    const subjects = Array.from(new Set(teachers.map(t => t.subject)));
    const roles = ['Admin', 'Teacher', 'Staff'];


    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4 sm:p-6 md:p-8`}>
                <div className={`${themeClasses.card} rounded-xl p-6 sm:p-8 w-full max-w-md shadow-lg border ${themeClasses.border}`}>
                    <div className="text-center mb-6">
                        <h1 className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-2 font-sans`}>EduApp</h1>
                        <p className={`text-sm sm:text-base ${themeClasses.tableSubtext} font-sans`}>Sign in to your account</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.tableSubtext} mb-1 font-sans`}>Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${themeClasses.iconColor}`} />
                                </div>
                                <input
                                    type="email"
                                    className={`pl-10 w-full py-2.5 px-3 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base ${themeClasses.text} transition-colors font-sans`}
                                    placeholder="you@example.com"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${themeClasses.tableSubtext} mb-1 font-sans`}>Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${themeClasses.iconColor}`} />
                                </div>
                                <input
                                    type="password"
                                    className={`pl-10 w-full py-2.5 px-3 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base ${themeClasses.text} transition-colors font-sans`}
                                    placeholder="••••••••"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            onClick={handleLogin}
                            className={`cursor-pointer w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-gray-50'} font-sans`}
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    return (
        <div className={`flex h-screen ${themeClasses.bg} ${themeClasses.text} overflow-x-auto `}>

            {/* Sidebar - Mobile Overlay */}
            {isMobileView && isSidebarOpen && (
                <div
                    className={`fixed inset-0 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-gray-900 bg-opacity-30'
                        } z-20 md:hidden`}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="cursor-pointer fixed bottom-4 right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
                {theme === 'dark' ? (
                    <Sun className="w-6 h-6 text-white" />
                ) : (
                    <Moon className="w-6 h-6 text-white" />
                )}
            </button>


            {/* Sidebar */}

            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:relative z-30 w-64 ${themeClasses.sidebar} h-full flex-shrink-0 
          transition-transform duration-300 ease-in-out border-r ${themeClasses.border}`}>
                <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b border-gray-700">
                        <h1 className="text-xl font-bold ml-[12px] font-sans">EduApp</h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <button
                                        className={`cursor-pointer flex items-center w-full p-2 rounded-lg transition-colors font-sans ${item.active ? themeClasses.navItemActive : themeClasses.navItem
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}


                <header className={`${themeClasses.header} border-b ${themeClasses.border} p-4 flex items-center justify-between flex-shrink-0`}>
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`mr-4 ${themeClasses.iconColor} ${themeClasses.iconHover} md:hidden`}
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold font-sans">Teacher Management</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex items-center space-x-2" ref={dropdownRef}>
                            <button
                                className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                aria-label="User menu"
                                aria-expanded={isProfileDropdownOpen}
                            >
                                <span className={`${themeClasses.profileText} cursor-pointer text-sm font-medium font-sans`}>AD</span>
                            </button>
                            <button
                                className={`cursor-pointer text-sm font-sans font-medium ${themeClasses.text} hidden md:inline hover:underline`}
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                aria-label="Toggle user menu"
                            >
                                {loggedInUser.name}
                            </button>
                            {isProfileDropdownOpen && (
                                <div className={`absolute right-0 top-10 mt-2 w-48 ${themeClasses.profileDropdown} rounded-lg shadow-lg py-1 z-30`}>
                                    <button
                                        onClick={handleViewProfile}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${themeClasses.profileDropdownItem}`}
                                        aria-label="View profile"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        <span className='font-sans cursor-pointer'> Profile Details</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center w-full px-4 py-2 text-sm ${themeClasses.profileDropdownItemDanger}`}
                                        aria-label="Logout"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span className='font-sans cursor-pointer'>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}

                <main className={`flex-1 overflow-auto p-4 ${themeClasses.bg}`}>

                    {/* Search and Filters */}
                    <div
                        className={`${themeClasses.wholeSearch} rounded-xl p-4 mb-6 `}

                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className={`${themeClasses.iconColor} w-5 h-5`} aria-hidden="true" />

                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search by name or email..."

                                    className={`w-full pl-10 pr-4 py-2.5 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}

                                />
                            </div>

                            {/* Filter Toggle Button (Mobile) */}
                            <button
                                className={`md:hidden flex items-center justify-center gap-2 ${themeClasses.filterButton} px-4 py-2.5 rounded-lg border ${themeClasses.border} transition-colors`}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                aria-expanded={isFilterOpen}
                                aria-controls="filter-panel"
                            >
                                <Filter className={`w-5 h-5 ${themeClasses.filterText}`} />
                                <span className={`font-sans ${themeClasses.filterText}`}>Filters</span>
                                <ChevronDown
                                    className={`w-5 h-5 ${themeClasses.filterText} transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Filters */}
                            <div
                                id="filter-panel"
                                className={`${isFilterOpen ? 'block' : 'hidden'} md:flex md:flex-row gap-3 w-full md:w-auto `}
                            >
                                <div className="relative w-full md:w-40">
                                    <select
                                        value={filters.subject}
                                        onChange={(e) => handleFilterChange(e, 'subject')}
                                        className={`cursor-pointer fobt-sans w-full appearance-none pl-3 pr-8 py-2.5 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                        aria-label="Filter by subject"
                                    >
                                        <option value="" className='cursor-pointer font-sans'>All Subjects</option>
                                        {subjects.map(subject => (
                                            <option className='font-sans cursor-pointer' key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.iconColor} pointer-events-none`}
                                    />
                                </div>

                                <div className="relative w-full md:w-32 mt-2 md:mt-0">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange(e, 'status')}
                                        className={`cursor-pointer w-full appearance-none pl-3 pr-8 py-2.5 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                        aria-label="Filter by status"
                                    >
                                        <option value="" className='cursor-pointer font-sans'>All Status</option>
                                        <option value="Active" className='cursor-pointer font-sans'>Active</option>
                                        <option value="Inactive" className='cursor-pointer font-sans'>Inactive</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="relative w-full md:w-32 mt-2 md:mt-0">
                                    <select
                                        value={filters.role}
                                        onChange={(e) => handleFilterChange(e, 'role')}
                                        className={`cursor-pointer w-full appearance-none pl-3 pr-8 py-2.5 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                        aria-label="Filter by role"
                                    >
                                        <option value="" className='cursor-pointer font-sans'>All Roles</option>
                                        {roles.map(role => (
                                            <option className='cursor-pointer font-sans' key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                {(filters.subject || filters.status || filters.role || searchQuery) && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 px-3 py-2 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium font-sans">
                            Teachers <span className="text-gray-400 font-sans">({filteredTeachers.length})</span>
                        </h3>
                        <button
                            onClick={() => setIsAddTeacherModalOpen(true)}
                            className="bg-indigo-600 text-white cursor-pointer px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-sm"
                            aria-label="Add new teacher"
                        >
                            <Plus className="w-5 h-5 mr-1" />
                            <span className='font-sans'>Add Teacher</span>
                        </button>
                    </div>

                    {/* Teacher List */}
                    {filteredTeachers.length > 0 ? (
                        isMobileView ? (
                            /* Mobile Card View */
                            <div className="space-y-3">
                                {filteredTeachers.map((teacher) => (
                                    <div key={teacher.id} className={`${themeClasses.card} rounded-xl p-4 border ${themeClasses.border}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <img
                                                    src={teacher.avatar}
                                                    alt={teacher.name}
                                                    className={`${themeClasses.card} rounded-full p-4 border ${themeClasses.border}`}

                                                />
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'
                                                    } ${teacher.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                                                    }`}></span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className={`font-sans font-medium ${themeClasses.tableText}`}>{teacher.name}</h3>
                                                        <p className={`font-sans text-sm ${themeClasses.tableSubtext}`}>{teacher.subject}</p>
                                                    </div>
                                                    <span className={`font-sans text-xs px-2 py-1 rounded-full ${teacher.status === 'Active'
                                                        ? themeClasses.statusActive
                                                        : themeClasses.statusInactive
                                                        }`}>
                                                        {teacher.status}
                                                    </span>
                                                </div>
                                                <p className={`font-sans text-sm ${themeClasses.tableSubtext} mt-1`}>{teacher.email}</p>
                                                <p className={`font-sans text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                    } mt-1`}>Last active: {teacher.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-700">
                                            <button
                                                onClick={() => handleView(teacher)}
                                                className={`cusrsor-pointer p-2 ${themeClasses.iconColor} ${themeClasses.iconHover} rounded-full ${themeClasses.hover} transition-colors`}
                                                aria-label={`View ${teacher.name}`}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(teacher)}
                                                className={`cursor-pointer p-2 ${themeClasses.iconColor} hover:text-yellow-500 rounded-full ${themeClasses.hover} transition-colors`} aria-label={`Edit ${teacher.name}`}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleSendMessage(teacher)}
                                                className={`cursor-pointer p-2 ${themeClasses.iconColor} hover:text-indigo-500 rounded-full ${themeClasses.hover} transition-colors`} aria-label={`Send message to ${teacher.name}`}
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher.id)}
                                                className={`cursor-pointer p-2 ${themeClasses.iconColor} hover:text-red-500 rounded-full ${themeClasses.hover} transition-colors`} aria-label={`Delete ${teacher.name}`}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Desktop Table View */
                            <div className={`${themeClasses.card} rounded-xl shadow-sm overflow-hidden border ${themeClasses.border}`}>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead
                                            className={themeClasses.tableHeader}
                                        >
                                            <tr>
                                                <th scope="col" className={`font-sans px-6 py-3 text-left text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Teacher
                                                </th>
                                                <th scope="col" className={`font-sans px-6 py-3 text-left text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Subject
                                                </th>
                                                <th scope="col" className={`font-sans px-6 py-3 text-left text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Status
                                                </th>
                                                <th scope="col" className={`font-sans px-6 py-3 text-left text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Role
                                                </th>
                                                <th scope="col" className={`font-sans px-6 py-3 text-left text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Last Active
                                                </th>
                                                <th scope="col" className={`font-sans px-6 py-3  text-center  text-xs font-medium ${themeClasses.filterText} uppercase tracking-wider`}>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`${themeClasses.bg} divide-y ${themeClasses.border}`}>
                                            {filteredTeachers.map((teacher) => (
                                                <tr key={teacher.id} className={themeClasses.tableRow}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 relative">
                                                                <img className="h-10 w-10 rounded-full object-cover font-sans" src={teacher.avatar} alt={teacher.name} />
                                                                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ${theme === 'dark' ? 'ring-gray-800' : 'ring-white'} ${teacher.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                                                                    }`}></span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className={`text-sm font-medium font-sans ${themeClasses.tableText}`}>{teacher.name}</div>
                                                                <div className={`text-sm font-sans ${themeClasses.tableSubtext}`}>{teacher.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-sans ${themeClasses.tableText}`}>{teacher.subject}</div>
                                                        <div className={`text-xs font-sans ${themeClasses.tableSubtext}`}>{teacher.department}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-sans font-semibold rounded-full ${teacher.status === 'Active'
                                                            ? themeClasses.statusActive
                                                            : themeClasses.statusInactive
                                                            }`}>
                                                            {teacher.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 inline-flex font-sans text-xs leading-5 font-semibold rounded-full ${themeClasses.roleAdmin}`}>                              {teacher.role}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap font-sans text-sm ${themeClasses.tableSubtext}`}>
                                                        {teacher.lastActive}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => handleView(teacher)}
                                                                className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                                                                aria-label={`View ${teacher.name}`}
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(teacher)}
                                                                className="cursor-pointer text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                                                                aria-label={`Edit ${teacher.name}`}
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage(teacher)}
                                                                className="cursor-pointer text-indigo-400 hover:text-indigo-300 p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                                                                aria-label={`Send message to ${teacher.name}`}
                                                            >
                                                                <Send className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(teacher.id)}
                                                                className="cursor-pointer text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                                                                aria-label={`Delete ${teacher.name}`}
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-700">
                            <div className="mx-auto max-w-md">
                                <Search className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-2 text-lg font-medium text-gray-100 font-sans">No teachers found</h3>
                                <p className="mt-1 text-sm text-gray-400 font-sans">
                                    Try adjusting your search or filter criteria
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="font-sans mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* View Teacher Modal */}

            {isViewModalOpen && selectedTeacher && (
                <div className="fixed inset-0  bg-black/60  bg-opacity-50 flex items-center justify-center z-30 p-4">
                    <div className={`${themeClasses.modal} rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-xl font-bold font-sans ${themeClasses.text}`}>Teacher Details</h3>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className={`${themeClasses.iconColor} ${themeClasses.iconHover} cursor-pointer`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mt-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedTeacher.avatar}
                                            alt={selectedTeacher.name}
                                            className={`w-32 h-32 rounded-full object-cover border-4 ${themeClasses.border} mx-auto`}
                                        />
                                        <div className="mt-4 text-center">
                                            <span className={`px-3 py-1 text-sm rounded-full font-sans ${selectedTeacher.status === 'Active' ? themeClasses.statusActive : themeClasses.statusInactive
                                                }`}>
                                                {selectedTeacher.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`text-2xl font-bold font-sans ${themeClasses.text}`}>{selectedTeacher.name}</h4>
                                        <p className={`font-sans ${themeClasses.tableSubtext}`}>{selectedTeacher.email}</p>

                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className={`font-sans text-sm font-medium ${themeClasses.tableSubtext}`}>Subject</h5>
                                                <p className={`font-sans ${themeClasses.text}`}>{selectedTeacher.subject}</p>
                                            </div>
                                            <div>
                                                <h5 className={`text-sm font-medium font-sans ${themeClasses.tableSubtext}`}>Department</h5>
                                                <p className={`${themeClasses.text} font-sans`}>{selectedTeacher.department}</p>
                                            </div>
                                            <div>
                                                <h5 className={`text-sm font-medium font-sans ${themeClasses.tableSubtext}`}>Phone</h5>
                                                <p className={`${themeClasses.text} font-sans`}>{selectedTeacher.phone}</p>
                                            </div>
                                            <div>
                                                <h5 className={`text-sm font-medium font-sans ${themeClasses.tableSubtext}`}>Join Date</h5>
                                                <p className={`${themeClasses.text} font-sans`}>
                                                    {new Date(selectedTeacher.joinDate || '').toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <h5 className={`text-sm font-medium font-sans ${themeClasses.tableSubtext}`}>Role</h5>
                                                <p className={` font-sans ${themeClasses.text}`}>{selectedTeacher.role}</p>
                                            </div>
                                            <div>
                                                <h5 className={`font-sans text-sm font-medium ${themeClasses.tableSubtext}`}>Last Active</h5>
                                                <p className={`font-sans ${themeClasses.text}`}>{selectedTeacher.lastActive}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`mt-8 pt-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
                                 
                                    <button
                                        onClick={() => handleSendMessage(selectedTeacher)}
                                        className="cursor-pointer font-sans px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Send Message
                                    </button>
                                    <button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className={`cursor-pointer font-sans px-4 py-2 ${themeClasses.filterButton} ${themeClasses.text} rounded-lg ${themeClasses.hover} transition-colors`}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Teacher Modal */}

            {/* Edit Teacher Modal */}
            {isEditModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-30 p-4">
                    <div className={`${themeClasses.modal} rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-xl font-bold font-sans ${themeClasses.text}`}>Edit Teacher</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className={`cursor-pointer ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mt-6">
                                {/* Image Upload Section */}
                                <div className="mb-6">
                                    <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-2`}>Profile Picture</label>
                                    <div
                                        className={`relative flex flex-col items-center justify-center h-40 w-full border-2 border-dashed ${themeClasses.border} rounded-lg ${themeClasses.input} hover:bg-opacity-80 transition-all`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files?.[0];
                                            if (file && file.type.startsWith('image/')) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setSelectedTeacher({ ...selectedTeacher, avatar: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    >
                                        {selectedTeacher.avatar ? (
                                            <img
                                                src={selectedTeacher.avatar}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <UserPlus className={`mx-auto h-8 w-8 ${themeClasses.iconColor}`} />
                                                <p className={`font-sans mt-2 text-sm ${themeClasses.tableSubtext}`}>
                                                    Drag and drop an image here or click to upload
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setSelectedTeacher({ ...selectedTeacher, avatar: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {selectedTeacher.avatar && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedTeacher({ ...selectedTeacher, avatar: '' })}
                                                className={`absolute top-2 right-2 p-1 rounded-full ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Other Input Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={selectedTeacher.name}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Email</label>
                                        <input
                                            type="email"
                                            defaultValue={selectedTeacher.email}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Subject</label>
                                        <select
                                            defaultValue={selectedTeacher.subject}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subject: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Science">Science</option>
                                            <option value="English">English</option>
                                            <option value="History">History</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Department</label>
                                        <input
                                            type="text"
                                            defaultValue={selectedTeacher.department}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, department: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Phone</label>
                                        <input
                                            type="tel"
                                            defaultValue={selectedTeacher.phone}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Status</label>
                                        <select
                                            defaultValue={selectedTeacher.status}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, status: e.target.value as 'Active' | 'Inactive' })}
                                            className={`cursor-pointer font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Role</label>
                                        <select
                                            defaultValue={selectedTeacher.role}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, role: e.target.value as 'Admin' | 'Teacher' | 'Staff' })}
                                            className={`font-sans cursor-pointer w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Last Active</label>
                                        <input
                                            type="text"
                                            value={selectedTeacher.lastActive || ''}
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, lastActive: e.target.value })}
                                            className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                    </div>
                                </div>

                                <div className={`mt-8 pt-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className={`font-sans cursor-pointer px-4 py-2 ${themeClasses.filterButton} ${themeClasses.text} rounded-lg ${themeClasses.hover} transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTeachers(teachers.map(t => t.id === selectedTeacher.id ? selectedTeacher : t));
                                            toast.success('Updated Changes successfully', {
                                                position: 'top-right',
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                theme: theme === 'dark' ? 'dark' : 'light',
                                            });
                                            setIsEditModalOpen(false);
                                        }}
                                        className="font-sans cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Teacher Modal */}
            {isAddTeacherModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-30 p-4">
                    <div className={`${themeClasses.modal} rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-sans text-xl font-bold ${themeClasses.text}`}>Add New Teacher</h3>
                                <button
                                    onClick={() => setIsAddTeacherModalOpen(false)}
                                    className={`cursor-pointer ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddTeacher}>
                                <div className="mt-6">
                                    {/* Image Upload Section */}
                                    <div className="mb-6">
                                        <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-2`}>Profile Picture</label>
                                        <div
                                            className={`relative flex flex-col items-center justify-center h-40 w-full border-2 border-dashed ${themeClasses.border} rounded-lg ${themeClasses.input} hover:bg-opacity-80 transition-all`}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type.startsWith('image/')) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setNewTeacher({ ...newTeacher, avatar: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        >
                                            {newTeacher.avatar ? (
                                                <img
                                                    src={newTeacher.avatar}
                                                    alt="Preview"
                                                    className="h-32 w-32 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <UserPlus className={`mx-auto h-8 w-8 ${themeClasses.iconColor}`} />
                                                    <p className={`font-sans mt-2 text-sm ${themeClasses.tableSubtext}`}>
                                                        Drag and drop an image here or click to upload
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setNewTeacher({ ...newTeacher, avatar: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            {newTeacher.avatar && (
                                                <button
                                                    type="button"
                                                    onClick={() => setNewTeacher({ ...newTeacher, avatar: '' })}
                                                    className={`absolute top-2 right-2 p-1 rounded-full ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Other Input Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Full Name</label>
                                            <input
                                                type="text"
                                                value={newTeacher.name}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Email</label>
                                            <input
                                                type="email"
                                                value={newTeacher.email}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Subject</label>
                                            <input
                                                type="text"
                                                value={newTeacher.subject}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Department</label>
                                            <input
                                                type="text"
                                                value={newTeacher.department}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Phone</label>
                                            <input
                                                type="tel"
                                                value={newTeacher.phone}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Status</label>
                                            <select
                                                value={newTeacher.status}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, status: e.target.value as 'Active' | 'Inactive' })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Role</label>
                                            <select
                                                value={newTeacher.role}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value as 'Admin' | 'Teacher' | 'Staff' })}
                                                className={`cursor-pointer font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                required
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`font-sans block text-sm font-medium ${themeClasses.tableSubtext} mb-1`}>Last Active</label>
                                            <input
                                                type="text"
                                                value={newTeacher.lastActive || ''}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, lastActive: e.target.value })}
                                                className={`font-sans w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                placeholder="e.g. 2 hours ago"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`mt-8 pt-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddTeacherModalOpen(false)}
                                        className={`font-sans cursor-pointer px-4 py-2 ${themeClasses.filterButton} ${themeClasses.text} rounded-lg ${themeClasses.hover} transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="font-sans cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Add Teacher
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Profile Details Modal */}

            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-30 p-4">
                    <div className={`${themeClasses.modal} rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-sans text-xl font-bold ${themeClasses.text}`}>Profile Details</h3>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className={`cursor-pointer ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                    aria-label="Close modal"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <h5 className={`font-sans text-sm font-medium ${themeClasses.tableSubtext}`}>Name</h5>
                                    <p className={`font-sans ${themeClasses.text}`}>{loggedInUser.name}</p>
                                </div>
                                <div>
                                    <h5 className={`font-sans text-sm font-medium ${themeClasses.tableSubtext}`}>Email</h5>
                                    <p className={`font-sans ${themeClasses.text}`}>{loggedInUser.email}</p>
                                </div>
                            </div>
                            <div className={`mt-8 pt-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className={`font-sans cursor-pointer px-4 py-2 ${themeClasses.filterButton} ${themeClasses.text} rounded-lg ${themeClasses.hover} transition-colors`}
                                    aria-label="Close"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="font-sans cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Message Modal */}
            {isSendModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-30 p-4">
                    <div className={`${themeClasses.modal} rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-xl font-bold font-sans ${themeClasses.text}`}>
                                    Send Message to {selectedTeacher.name}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsSendModalOpen(false);
                                        setMessageContent('');
                                    }}
                                    className={`cursor-pointer ${themeClasses.iconColor} ${themeClasses.iconHover}`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mt-6">
                                <div className="mb-4">
                                    <label className={`block text-sm font-medium font-sans ${themeClasses.tableSubtext} mb-1`}>
                                        Message
                                    </label>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className={`w-full px-3 py-2 ${themeClasses.input} border ${themeClasses.border} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px] font-sans`}
                                        placeholder="Type your message here..."
                                    />
                                </div>

                                <div className={`mt-6 pt-4 border-t ${themeClasses.border} flex justify-end gap-3`}>
                                    <button
                                        onClick={() => {
                                            setIsSendModalOpen(false);
                                            setMessageContent('');
                                        }}
                                        className={`cursor-pointer px-4 py-2 ${themeClasses.filterButton} ${themeClasses.text} rounded-lg ${themeClasses.hover} transition-colors font-sans`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log(`Message to ${selectedTeacher.email}:`, messageContent);
                                            setIsSendModalOpen(false);
                                            setMessageContent('');
                                            setNotification({
                                                show: true,
                                                message: `Message sent to ${selectedTeacher.name}`,
                                                type: 'success'
                                            });
                                            setTimeout(() => setNotification({ ...notification, show: false }), 3000);
                                        }}
                                        className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-sans"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${notification.type === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                    } flex items-center justify-between`}>
                    <span>{notification.message}</span>
                    <button
                        onClick={() => setNotification({ ...notification, show: false })}
                        className="ml-4"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
            />

        </div>
    );
};

export default TeacherManagement;
