import React, { useState } from 'react'
import database from '../Utils/handelDatabase'
import helpers from '../Utils/helpers'
import { Status } from '../Components/Status'
import Loading from '../Components/Loading/Loading'

export const Order = ({ data, updateUi }) => {
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState("")
    const [id, setId] = useState(null)
    const optionStyle = 'h-[50px] w-[150px] flex justify-center items-center font-medium'
    const [optionActive, setOptionActive] = useState(0)
    const options = ["All", "Processing", "Delivered", "Cancelled"]
    let currentTime = helpers.getCurrentTime()
    const handleSetId = (id) => {
        setShow(!show)
        setId(id)
    }
    const handelUpdateStatus = () => {
        setShow(!show)
        database.handelUpdateStatus(id, status, currentTime, updateUi)
    }
    console.log(status);
    const filteredOrders = () => {
        switch (optionActive) {
            case 0:
                return data;
            case 1:
                return data.filter(order => order.status === "processing");
            case 2:
                return data.filter(order => order.status === "delivered");
            case 3:
                return data.filter(order => order.status === "cancelled");
            default:
                return [];
        }
    }
    const filteredData = filteredOrders();
    console.log(filteredData);
    return (
        <div className='p-5 min-h-screen'>
            {show && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <form onSubmit={() => { handelUpdateStatus() }} className=" text-[#100e3d] relative text-center transform rounded-lg bg-white shadow-xl transition-all p-5 flex flex-col">
                            <span className=' uppercase font-semibold mb-5'>Update status</span>
                            <select onChange={(e) => { setStatus(e.target.value) }} className='w-[200px] h-[40px] rounded-[5px] outline-none border-[2px] border-[#100e3d]'>
                                <option value="">Select status</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button type='submit' className='w-[200px] h-[40px] rounded-[5px] bg-[#100e3d] text-white mt-5'>Confirm</button>
                            <span onClick={() => { setShow(!show) }} className='cursor-pointer text-center rounded-[5px] text-[#100e3d] mt-2'>Cancel</span>
                        </form>
                    </div>
                </div>
            </div>}
            <div className="">
                <div className="p-5 bg-white rounded-md shadow-lg">
                    <h1 className='text-[20px] font-semibold'>Orders</h1>
                    <div className="flex mt-4">
                        <div className="flex w-[350px] rounded bg-slate-300">
                            <input onChange={(e) => { }} className=" w-full border-none bg-transparent px-3 py-1 text-gray-400 outline-none focus:outline-none " type="search" name="search" placeholder="Search..." />
                            <input onChange={(e) => { }} className=" w-full border-none bg-transparent px-3 py-1 text-gray-400 outline-none focus:outline-none " type="date" name="search" placeholder="Search..." />
                            <button type="submit" className="m-2 rounded bg-main px-4 py-1 text-white">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="mt-5 bg-main text-white rounded-t-md shadow-lg">
                <div className="flex">
                    {options.map((item, i) => {
                        return (
                            <button
                                onClick={() => { setOptionActive(i) }}
                                className={optionActive === i ? `${optionStyle} border-b-2 border-blue-600 text-blue-600` : optionStyle}
                            >
                                {item}
                            </button>)
                    })}
                </div>
            </div>
            {filteredData?.length == 0 ?
                <Loading /> :
                <div className="">
                    <table className='w-full text-left bg-white rounded-md min-w-full table-fixed shadow-xl'>
                        <tr className=' font-medium text-main h-[40px] uppercase'>
                            <th className='px-4 py-2 text-gray-500 text-[12px]'>OrderID</th>
                            <th className='px-4 py-2 text-gray-500 text-[12px]'>CusName</th>
                            <th className='px-4 py-2 text-gray-500 w-[130px] text-[12px]'>Order Date</th>
                            <th className='px-4 py-2 text-gray-500 text-[12px]'>Received Date</th>
                            <th className='px-4 py-2 text-gray-500 text-[12px]'>Status</th>
                            <th className='px-4 py-2 text-gray-500 text-[12px]'>Action</th>
                            <th className=" w-[50px]"></th>
                        </tr>
                        {
                            filteredData?.slice().reverse().map((item, index) => {
                                return (
                                    <tr key={index} className='hover:bg-gray-100'>
                                        <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap lg:p-5'>
                                            {item.id.slice(1)}
                                        </td>
                                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap lg:p-5">
                                            <div className="text-base font-semibold text-gray-900" bis_skin_checked="1">{item.cusName}</div>
                                        </td>
                                        <td className='p-4 text-base font-medium text-gray-950 whitespace-nowrap lg:p-5'>{item.orderDate}</td>
                                        <td className='p-4 text-base font-medium text-gray-950 whitespace-nowrap lg:p-5'>
                                            {item.receivedDate ? item.receivedDate : "Not delivery"}
                                        </td>
                                        <td className='p-4 text-sm font-medium text-gray-950 whitespace-nowrap lg:p-5 capitalize'>
                                            <span><Status status={item.status} /></span>
                                        </td>
                                        <td className='p-4 space-x-2 whitespace-nowrap lg:p-5'>
                                            <button
                                                onClick={() => { handleSetId(item.id) }}
                                                className='inline-flex items-center py-2 px-3 text-sm font-medium text-center bg-main text-white rounded-lg hover:scale-[1.02] transition-transform'
                                            >
                                                Set status
                                            </button>
                                        </td>
                                        <td className=''>
                                            <a href={`/Orders/${item.id}`}>
                                                <i class="text-blue-600 fa-solid fa-circle-info fa-lg"></i>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            }
        </div>
    )
}
