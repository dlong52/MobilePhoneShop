import React, { useState } from 'react';
import Loading from '../Components/Loading/Loading';

export const User = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = data.filter((user) => {
        const normalizedQuery = searchQuery.toLowerCase();
        return (
            user.username.toLowerCase().includes(normalizedQuery) ||
            user.email.toLowerCase().includes(normalizedQuery) ||
            (user.phoneNumber && user.phoneNumber.includes(searchQuery))
        );
    });

    return (
        <div className='p-5 min-h-screen'>
            <div className='p-5 bg-white rounded-md shadow-lg'>
                <h1 className='text-[20px] font-semibold'>All users</h1>
                <div className='flex mt-4'>
                    <div className='flex w-[350px] rounded bg-slate-300'>
                        <input
                            onChange={handleSearch}
                            value={searchQuery}
                            className='w-full border-none bg-transparent px-3 py-1 text-gray-400 outline-none focus:outline-none'
                            type='search'
                            name='search'
                            placeholder='Search by username, email, or phoneNumber...'
                        />
                        <button type='submit' className='m-2 rounded bg-blue-600 px-4 py-1 text-white'>
                            <i className='fa-solid fa-magnifying-glass'></i>
                        </button>
                    </div>
                </div>
            </div>
            {data?.length === 0 ? (
                <Loading />
            ) : (
                <div className='mt-5'>
                    <table className='w-full text-center bg-white rounded-md min-w-full divide-y divide-gray-200 table-fixed shadow-xl'>
                        <thead>
                            <tr className='font-medium text-main h-[40px]'>
                                <th className='w-1/12'></th>
                                <th>CusName</th>
                                <th>Email</th>
                                <th>Registration Date</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={index} className='hover:bg-gray-100'>
                                    <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap lg:p-5'>
                                        {index + 1}
                                    </td>
                                    <td className='p-4 text-sm font-normal text-gray-500 whitespace-nowrap lg:p-5'>
                                        <div className='text-base font-semibold text-gray-900'>{user.username}</div>
                                    </td>
                                    <td className='p-4 text-base font-medium text-gray-950 text-wrap lg:p-5'>{user.email}</td>
                                    <td className='p-4 text-base font-medium text-gray-950 whitespace-nowrap lg:p-5'>
                                        {user.created_at}
                                    </td>
                                    <td className='p-4 text-base font-medium text-gray-950 whitespace-nowrap lg:p-5 capitalize'>
                                        {user.phoneNumber ? user.phoneNumber : 'Not update'}
                                    </td>
                                    <td className='p-4 space-x-2 whitespace-nowrap lg:p-5 capitalize'>{user.role ? user.role : 'Normal'}</td>
                                    <td>
                                        <a href={`/Users/${user.id}`}>
                                            <i className='text-blue-600 fa-solid fa-circle-info fa-lg'></i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default User;
