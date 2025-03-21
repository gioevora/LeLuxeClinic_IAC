"use client";

import React, { useEffect, useState } from 'react';

import { getBlogs } from '@/components/admin/blogs/Action';
import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";
import { truncateText } from '@/components/globals/Utils';
import SeeMoreModal from '@/components/globals/SeeMoreModal';
import { Image } from '@heroui/react';


export default function Blogs() {
    // const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState();

    // useEffect(() => {
    //     const fetchBlogs = async () => {
    //         try {
    //             const response = await getBlogs();
    //             setBlogs(response.records);
    //         } catch (error) {
    //             console.error("Error fetching blogs:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchBlogs();
    //     const interval = setInterval(fetchBlogs, 5000);
    //     return () => clearInterval(interval);
    // }, []);

    const blogs = [
        {
            id: "1",
            imageUrl: "https://juantap-bakit.s3.ap-southeast-1.amazonaws.com/avatars/sakamoto-days-anime-hd-wallpaper-uhdpaper.com-239%405%40a.jpg",
            title: "Sakamoto Days",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis, cumque! Dicta aspernatur at quibusdam voluptatem eveniet voluptas distinctio debitis asperiores? Repudiandae dicta, minus perferendis ullam incidunt maxime veniam error iure?",
            author: "John Doe",
            date: "March 19, 2025",
            link: "https://next-auth.js.org/configuration/callbacks",
        }
    ];

    return (
        <div className="py-12">
            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Le Luxe Clinic Blogs</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500  font-normal:mt-4">
                        Discover expert insights on beauty, skincare, and wellness.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 py-8">
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
                            <Card key={blog.id}>
                                <CardBody>
                                    <Image
                                        className="object-cover"
                                        src={`${blog.imageUrl}`}
                                        alt={blog.title}
                                        width={1000}
                                        height={200}
                                    />

                                    <div className="flex flex-col">
                                        <div className="py-2">
                                            <a href="#" className="mt-1 block">
                                                <p className="text-xl font-semibold text-gray-900">{blog.title}</p>
                                                <p className="text-base text-gray-500 line-clamp-3">{blog.description}
                                                    {blog.description.length > 50 && (
                                                        <SeeMoreModal title="Full Description" content={blog.description} />
                                                    )}
                                                </p>
                                            </a>
                                        </div>

                                        <div className="flex justify-between items-center py-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    <a href="#" className="hover:underline">{blog.author}</a>
                                                </p>
                                                <div className="flex space-x-1 text-sm text-gray-500">
                                                    <time dateTime={blog.date}>{blog.date}</time>
                                                    <span aria-hidden="true">·</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <a href={blog.link} target="_blank" rel="noopener noreferrer" className="inline-block text-yellow-600 font-medium">
                                                    Read More
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
