'use client';

import React, { useState, useEffect } from 'react';
import { getAll } from '@/components/admin/services/Action';
import { LuSearch } from "react-icons/lu";

type Category = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: string;
  imageUrl: string;
  categoryId: number;
  category: Category;
};

export default function ServicesOffer() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getAll();
      if (response.code === 200) {
        const validServices = response.records.filter(service => service.categoryId !== undefined) as Service[];
        setServices(validServices);
        setFilteredServices(validServices);
      } else {
        console.error('Error fetching services:', response.message);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const filterServicesByCategory = () => {
      const categoryFromURL = decodeURIComponent(window.location.hash.replace('#', ''));
      setSelectedCategory(categoryFromURL);
      if (categoryFromURL && categoryFromURL !== 'All Services') {
        setFilteredServices(services.filter(service => service.category.name === categoryFromURL));
      } else {
        setFilteredServices(services);
      }
    };

    filterServicesByCategory();
    window.addEventListener('hashchange', filterServicesByCategory);
    return () => window.removeEventListener('hashchange', filterServicesByCategory);
  }, [services]);

  const handleCategoryClick = (categoryName: string) => {
    window.location.hash = categoryName;
  };

  const truncateDescription = (description: string, maxLength = 100) => {
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="mx-auto max-w-7xl py-24 px-4 mt-1">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <a
            href="#All Services"
            onClick={() => handleCategoryClick('All Services')}
            className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-bold transition-all ${selectedCategory === 'All Services' || !selectedCategory ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'}`}
          >
            All Services
          </a>
          {services
            .filter((value, index, self) => index === self.findIndex(t => t.category.name === value.category.name))
            .map((service) => (
              <a
                key={service.category.id}
                href={`#${service.category.name}`}
                onClick={() => handleCategoryClick(service.category.name)}
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-bold transition-all ${selectedCategory === service.category.name ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'}`}
              >
                {service.category.name}
              </a>
            ))}
        </div>

        <div className="flex justify-center mb-4">
          <div className="relative w-1/2">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 animate-fadeIn">
          {filteredServices
            .filter(service =>
              service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.price.toString().includes(searchQuery) ||
              service.duration.toString().includes(searchQuery)
            )
            .map((service) => (
              <div
                key={service.id}
                className="divide-y bg-white divide-gray-200 rounded-lg border shadow-md hover:bg-yellow-50 hover:shadow-2xl flex flex-col justify-between h-[400px]"
              >
                <div className="p-4 sm:p-6 flex-grow">
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-28 sm:h-32 object-cover rounded-t-lg"
                    />
                  )}
                  <h2 className="text-sm sm:text-lg font-bold leading-6 text-yellow-600 mt-2">{service.name}</h2>
                  <p className="text-xs sm:text-sm font-thin italic text-gray-800">
                    {truncateDescription(service.description)}
                    {service.description.length > 100 && (
                      <button onClick={() => setSelectedService(service)} className="text-yellow-600 underline ml-1">Read More</button>
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-bold">Duration: </span>
                    {service.duration} {service.durationUnit}
                  </p>
                </div>
                <p className="text-xl sm:text-4xl font-bold text-gray-900 text-center mb-4">₱ {formatPrice(service.price)}</p>
              </div>
            ))}
        </div>

        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg">
              <h2 className="text-xl font-bold mb-4">{selectedService.name}</h2>
              <p>{selectedService.description}</p>
              <button onClick={() => setSelectedService(null)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}