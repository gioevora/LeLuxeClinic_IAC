import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAll } from '@/components/admin/services/Action';
import { XMarkIcon } from '@heroicons/react/16/solid';
import Notification from '../notification/notification';


type Category = {
    id: number;
    name: string;
};

type Service = {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    category: Category;
};


function NavBar() {
    const [activeLink, setActiveLink] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [navbarOpen, setnavbarOpen] = useState(false);

    const toggleSidebar = () => {
        setnavbarOpen(!navbarOpen);
    };

    const closeSidebar = () => {
        setnavbarOpen(false);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const fetchServices = async () => {
                const response = await getAll();
                if (response.code === 200) {
                    const validServices = response.records.filter(service => service.categoryId !== undefined) as Service[];
                    setServices(validServices);
                } else {
                    console.error('Error fetching services:', response.message);
                }
            };
            fetchServices();
        }
    }, [isMounted]);

    const handleCategoryClick = (categoryName: string) => {
        setIsDropdownOpen(false);
        window.location.hash = `#${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
    };

    if (!isMounted) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/50 backdrop-blur-lg shadow-md transition-all duration-300">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-2">
                <a href="/" className="flex items-center space-x-3">
                    <Image src="/images/logonav.png" alt="Le Luxe Logo" width={200} height={60} />
                </a>

                {/* Desktop Navbar */}
                <nav className="hidden md:flex space-x-8">
                    {[{ name: 'Home', link: '/' }, { name: 'About Us', link: '/user/about-us' }, { name: 'Blogs', link: '/user/blogs' }].map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            onClick={() => setActiveLink(item.link)}
                            className={`text-gray-800 text-lg font-semibold hover:text-yellow-600 transition-all ${activeLink === item.link ? 'border-b-2 border-yellow-600' : ''}`}
                        >
                            {item.name}
                        </a>
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button
                            className={`text-gray-800 text-lg font-semibold hover:text-yellow-600 transition-all ${activeLink.startsWith('/user/service-offer') ? 'border-b-2 border-yellow-600' : ''}`}
                        >
                            Services
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2 z-50">
                                <a
                                    href="/user/service-offer"
                                    onClick={() => handleCategoryClick('All Services')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-yellow-100"
                                >
                                    All Services
                                </a>
                                {services
                                    .filter((value, index, self) => index === self.findIndex(t => t.category.name === value.category.name))
                                    .map((service) => (
                                        <a
                                            key={service.id}
                                            href={`/user/service-offer#${service.category.name}`}
                                            onClick={() => handleCategoryClick(service.category.name)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-yellow-100"
                                        >
                                            {service.category.name}
                                        </a>
                                    ))}
                            </div>
                        )}
                    </div>

                    <a
                        href="/user/contact-us"
                        onClick={() => setActiveLink('/user/contact-us')}
                        className={`text-gray-800 text-lg font-semibold hover:text-yellow-600 transition-all ${activeLink === '/user/contact-us' ? 'border-b-2 border-yellow-600' : ''}`}
                    >
                        Contact Us
                    </a>

                    <div className="flex items-center space-x-4">
                        <a href="/user/appointment-form" className="px-6 py-2 text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg hover:scale-105 transition">
                            Book a Consultation
                        </a>
                    </div>
                    <Notification/>
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-3 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {/* Sidebar for Mobile View */}
                <div className={`w-64 min-h-screen h-screen bg-gradient-to-b from-white to-white
                    flex flex-col overflow-y-auto fixed top-0 left-0 z-40
                    transition-transform transform
                    lg:relative lg:z-auto lg:h-auto ${navbarOpen ? "block" : "hidden"} md:hidden`}>
                    <div className="flex items-center justify-center mt-10 mb-3">
                        <div className="flex flex-col items-center text-center font-thin ">
                            <Image
                                src="/images/logonav.png"
                                alt="Admin Panel Logo"
                                width={200}
                                height={200}
                                className="mb-2"
                            />
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="absolute top-4 right-4 text-black"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4 p-6">
                        <a
                            href="/"
                            onClick={() => setActiveLink('/')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            Home
                        </a>
                        <a
                            href="/user/about-us"
                            onClick={() => setActiveLink('/user/about-us')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/user/about-us' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            About Us
                        </a>
                        <a
                            href="/user/blogs"
                            onClick={() => setActiveLink('/user/blogs')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/user/blogs' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            Blogs
                        </a>
                        <a
                            href="/user/contact-us"
                            onClick={() => setActiveLink('/user/contact-us')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/user/contact-us' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            Contact Us
                        </a>
                        <a
                            href="/user/service-offer"
                            onClick={() => setActiveLink('/user/service-offer')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/user/service-offer' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            Services
                        </a>
                        <a
                            href="/user/appointment-form"
                            onClick={() => setActiveLink('/user/appointment-form')}
                            className={`text-lg py-2 px-4 rounded-md transition-all ${activeLink === '/user/appointment-form' ? 'bg-yellow-500 text-white' : 'text-gray-700'}`}
                        >
                            Book a Consultation
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default NavBar;
