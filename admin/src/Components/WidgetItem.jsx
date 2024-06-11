import React from 'react'

export const WidgetItem = ({ content, title, icon }) => {
    return (
        <a class="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
            href="#">
            <div class="p-5">
                <div class="flex justify-between">
                    {icon}
                    <div
                        class="bg-green-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                        <span class="flex items-center">30%</span>
                    </div>
                </div>
                <div class="ml-2 w-full flex-1">
                    <div>
                        <div class="mt-3 text-3xl font-bold leading-8">{content}</div>

                        <div class="mt-1 text-base text-gray-600">{title}</div>
                    </div>
                </div>
            </div>
        </a>
    )
}
