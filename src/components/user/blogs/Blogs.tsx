"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getBlogs } from '@/components/admin/blogs/Action';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import { truncateText } from '@/components/globals/Utils';
import SeeMoreModal from '@/components/globals/SeeMoreModal';


export default function Blogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogs();
                setBlogs(response.records);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
        const interval = setInterval(fetchBlogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-white px-6 pt-2 pb-20 lg:px-8 lg:pt-24 lg:pb-28 mb-30">
            <div className="relative mx-auto max-w-5xl">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Le Luxe Clinic Blogs</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500  font-normal:mt-4">
                        Discover expert insights on beauty, skincare, and wellness.
                    </p>
                </div>
                <div className="mx-auto mt-12 grid max-w-lg gap-4 lg:max-w-none lg:grid-cols-3 h-full lg:h-[490px]">
                    {loading ? (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Card key={index} className="w-[300px] space-y-5 p-4" radius="lg">
                                    <Skeleton className="rounded-lg">
                                        <div className="h-24 rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <div className="space-y-3">
                                        <Skeleton className="w-4/5 rounded-lg">
                                            <div className="h-8 w-3/5 rounded-lg bg-default-200" />
                                        </Skeleton>
                                        <Skeleton className="w-5/5 rounded-lg">
                                            <div className="h-8 w-4/5 rounded-lg bg-default-200" />
                                        </Skeleton>
                                        <Skeleton className="w-3/5 rounded-lg">
                                            <div className="h-8 w-2/5 rounded-lg bg-default-300" />
                                        </Skeleton>
                                    </div>
                                </Card>
                            ))}
                        </>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg 
                             hover:bg-yellow-50 hover:shadow-2xl hover:ring-2 hover:ring-yellow-400 max-w-[500px]">
                                <div className="flex-shrink-0 h-[200px]">
                                    {blog.imageUrl ? (
                                        <Image
                                            className="h-full w-full object-cover transition-all duration-300 ease-in-out transform hover:scale-105"
                                            src={`${blog.imageUrl}`}
                                            alt={blog.title}
                                            width={300}
                                            height={300}
                                            quality={100}
                                        />
                                    ) : (
                                        <div className="h-52 w-full bg-gray-200 flex justify-center items-center text-gray-500">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between bg-white p-6 h-[200px]">
                                    <div className="flex-1">
                                        <a href="#" className="mt-1 block">
                                            <p className="text-xl font-semibold text-gray-900">{blog.title}</p>
                                            <p className="mt-3 text-base text-gray-500">{truncateText(blog.description, 170)}
                                                {blog.description.length > 50 && (
                                                    <SeeMoreModal title="Full Description" content={blog.description} />
                                                )}
                                            </p>
                                        </a>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                <a href="#" className="hover:underline">{blog.author}</a>
                                            </p>
                                            <div className="flex space-x-1 text-sm text-gray-500">
                                                <time dateTime={blog.date.toISOString()}>{blog.date.toLocaleDateString()}</time>
                                                <span aria-hidden="true">·</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="inline-block text-yellow-600 font-medium">
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
