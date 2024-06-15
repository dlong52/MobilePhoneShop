import React, { useState } from 'react'
import Loading from '../Components/Loading/Loading'
import BrandForm from '../Components/BrandForm'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditBrandForm from '../Components/EditBrandForm';
import database from '../Utils/handelDatabase';
export const Category = ({ data, updateUi }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [id, setId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [searchVal, setSearchVal] = useState('');
    const notify = (content, type) => { toast[type](content) };

    const handleShowEditForm = (item) => {
        setShowEditForm(!showEditForm);
        setEditItem(item);
    };

    const showConfirmDeleteProduct = (id, name) => {
        setShowConfirm(!showConfirm);
        setId(id);
    };

    const handleShowCreateForm = () => setShowCreateForm(!showCreateForm);

    // Filtered data based on searchVal
    const filteredData = data?.filter(item =>
        item.name.toLowerCase().includes(searchVal.toLowerCase())
    );
    return (
        <div className="">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
            {showCreateForm && <BrandForm show={() => { handleShowCreateForm() }} updateUi={updateUi} notify={notify} />}
            {showEditForm && <EditBrandForm show={() => { handleShowEditForm() }} brandData={editItem} notify={notify} updateUi={updateUi} />}
            {showConfirm &&
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">DELETE {name}</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-red-600">Are you sure you want to delete {name}? All data of {name} will be permanently deleted. This action cannot be undone.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button onClick={() => { database.deleteCategory(id, updateUi, notify, showConfirmDeleteProduct) }} type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                    <button onClick={() => { setShowConfirm(!showConfirm) }} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {(!showCreateForm && !showEditForm) && <div className="p-5">
                <div className="p-5 bg-white rounded-md shadow-lg">
                    <h1 className='text-[20px] font-semibold'>All brands</h1>
                    <div className="flex mt-4">
                        <div className="flex w-[350px] rounded bg-slate-300">
                            <input onChange={(e) => setSearchVal(e.target.value)} value={searchVal} className="w-full border-none bg-transparent px-3 py-1 text-gray-400 outline-none focus:outline-none" type="search" name="search" placeholder="Search..." />
                            <button type="submit" className="m-2 rounded bg-main px-4 py-1 text-white">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        <button onClick={() => { handleShowCreateForm() }} className="bg-main hover:bg-blue-900 text-white font-bold py-2 px-4 border-b-4 border-blue-800 hover:border-blue-500 rounded ml-7">
                            <i className="fa-solid fa-plus"></i> Add brand
                        </button>
                    </div>
                </div>
                <div className="mt-5">
                    {
                        filteredData?.length == 0 ?
                            <Loading /> :
                            <table className='w-full text-center bg-white rounded-md min-w-full table-fixed shadow-xl'>
                                <tr className=' font-medium text-main h-[40px] uppercase text-[16px]'>
                                    <th className='bg-main text-white text-[12px] rounded-tl-md'>Category ID</th>
                                    <th className='bg-main text-white text-[12px]'>Name</th>
                                    <th className='bg-main text-white text-[12px]'>Image</th>
                                    <th className='bg-main text-white text-[12px] w-[250px] rounded-tr-md'>Action</th>
                                </tr>
                                {
                                    data?.slice().reverse().map((item, index) => {
                                        return (
                                            <tr className='hover:bg-gray-100'>
                                                <td className='p-4 text-base font-medium text-gray-950 whitespace-nowrap lg:p-5'>{item.id}</td>
                                                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap lg:p-5">
                                                    <div className="text-base font-semibold text-gray-900" bis_skin_checked="1">{item.name}</div>
                                                </td>
                                                <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap lg:p-5 flex justify-center'>
                                                    <img className='h-[60px]' src={item.image} alt="" />
                                                </td>
                                                <td className='p-4 space-x-2 whitespace-nowrap lg:p-5'>
                                                    <button onClick={() => { handleShowEditForm(item) }} className='inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:text-gray-900 hover:scale-[1.02] transition-all'>Edit</button>

                                                    <button onClick={() => { showConfirmDeleteProduct(item.id, item.name); }} className='inline-flex items-center py-2 px-3 text-sm font-medium text-center bg-main text-white rounded-lg hover:scale-[1.02] transition-transform'>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                    }
                </div>
            </div>}
        </div>
    )
}
