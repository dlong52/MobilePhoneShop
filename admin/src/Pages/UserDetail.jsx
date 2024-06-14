import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import database from '../Utils/handelDatabase'
import { Status } from '../Components/Status'
import helpers from '../Utils/helpers'

export const UserDetail = ({ orders, updateUi }) => {
  const userId = useParams()
  const [data, setData] = useState(null)
  const [userOrder, setUserOrder] = useState(null)
  const [show, setShow] = useState(false)
  const [role, setRole] = useState(null)
  const [showRole, setShowRole] = useState(false)
  const [status, setStatus] = useState("")
  const [id, setId] = useState(null)
  let currentTime = helpers.getCurrentTime()
  const handleSetId = (id) => {
    setShow(!show)
    setId(id)
  }
  const handelUpdateStatus = () => {
    setShow(!show)
    database.handelUpdateStatus(id, status, currentTime, updateUi)
  }
  const handelUpdateRole = () => {
    setShowRole(!showRole)
    database.handelUpdateRole(userId?.userId, role, updateUi)
  }
  useEffect(() => {
    fetchUser()
    if (data?.orders) {
      setUserOrder((Object.keys((data?.orders)).map((key) => ({ id: key, ...(data?.orders)[key] }))));
    } else {
      setUserOrder([])
    }
  }, [userId, orders])
  const fetchUser = async () => {
    const user = await database.fetchUserDataByCode(userId.userId)
    setData(user)
  }
  const handelTotal = (status) => {
    return (allMyOrderData?.filter(order => order.status === status).reduce((sum, order) => sum + order.totalPrice, 0)) / 1000000;
  }
  const myOrderIds = userOrder?.map(order => order.id)
  const allMyOrderData = orders?.filter(order => myOrderIds?.includes(order.id))
  return (
    <div className='p-5 min-h-screen'>
      {show &&
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <form onSubmit={() => { handelUpdateStatus() }} action='' method='POST' className=" text-[#100e3d] relative text-center transform rounded-lg bg-white shadow-xl transition-all p-5 flex flex-col">
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
      {showRole &&
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <form onSubmit={() => { handelUpdateRole() }} action='' method='POST' className=" text-[#100e3d] relative text-center transform rounded-lg bg-white shadow-xl transition-all p-5 flex flex-col">
                <span className=' uppercase font-semibold mb-5'>Update Role</span>
                <select onChange={(e) => { setRole(e.target.value) }} className='w-[200px] h-[40px] rounded-[5px] outline-none border-[2px] border-[#100e3d]'>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="normal">Normal user</option>
                </select>
                <button type='submit' className='w-[200px] h-[40px] rounded-[5px] bg-[#100e3d] text-white mt-5'>Confirm</button>
                <span onClick={() => { setShowRole(!showRole) }} className='cursor-pointer text-center rounded-[5px] text-[#100e3d] mt-2'>Cancel</span>
              </form>
            </div>
          </div>
        </div>}
      <div className=" grid grid-cols-6 gap-x-3">
        <div className=" col-span-2 bg-white rounded-lg overflow-hidden p-3 shadow-lg">
          <div className=" relative w-full h-[100px] bg-main rounded-lg">
            <div className="flex justify-center items-center border-[5px] border-[#29b6f6] absolute w-[75px] aspect-square rounded-full bg-white -bottom-1/4 left-[30px]">
              <i class="text-[#29b6f6] fa-solid fa-user fa-xl"></i>
            </div>
          </div>
          <div className="mt-[30px] flex flex-col">
            <span className='text-[20px] font-semibold capitalize'>{data?.username} ({data?.role? data.role : "normal user"})</span>
            <span>#ID: {userId.userId}</span>
            <div className="flex flex-col mt-5 gap-y-1 font-medium text-gray-600">
              <span>Email: {data?.email}</span>
              <span>Phone: (+84){data?.phoneNumber.slice(1)}</span>
            </div>
            <div className="mt-5 flex">
              <div className="">
                <span className='font-semibold'>Address</span>
                <div className="flex flex-col text-gray-600 gap-y-1">
                  <span>Detail Adress: {data?.address?.detailAddress}</span>
                  <span>Ward: {data?.address?.ward}</span>
                  <span>District: {data?.address?.district}</span>
                  <span>Province: {data?.address?.province}</span>
                </div>
              </div>
              <div className="flex-1 relative ">
                <button onClick={()=>{setShowRole(!showRole)}} className='bottom-0 right-0 absolute w-[100px] h-[40px] bg-blue-400 text-white rounded-md'>Set role</button>
              </div>
            </div>
          </div>
        </div>
        <div className=" col-span-4 bg-white rounded-lg shadow-lg p-5">
          <div className="grid grid-cols-3 justify-between gap-x-2">
            <div className="bg-gray-200 p-3 rounded-md">
              <div className="text-[20px] font-semibold text-gray-700">{userOrder?.length}</div>
              <div className="text-gray-500">Total order</div>
            </div>
            <div className="bg-green-200 p-3 rounded-md">
              <div className="text-[20px] font-semibold text-green-700">{helpers.numberFormat(handelTotal("delivered"))} M</div>
              <div className="text-green-500">Invoices paid</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-md">
              <div className="text-[20px] font-semibold text-orange-700">{helpers.numberFormat(handelTotal("processing"))} M</div>
              <div className="text-orange-500">Invoice pending</div>
            </div>
          </div>
          <table className='w-full text-left bg-white mt-4 rounded-md'>
            <tr className=' font-medium text-main bg-main text-white'>
              <th className='text-white p-4 rounded-tl-md'>Order</th>
              <th className='text-white p-4'>Status</th>
              <th className='text-white p-4'>Total Payment</th>
              <th className='text-white p-4 rounded-tr-md'></th>
            </tr>
            {
              allMyOrderData?.map((item, index) => {
                return (
                  <tr className=''>
                    <td className='text-sm font-normal text-gray-500 whitespace-nowrap p-4'>
                      <div className="flex">
                        <div><i class="fa-regular fa-file-lines"></i></div>
                        <div className="ml-3 text-left">
                          <div>ID: {item.id}</div>
                          <div className="">ODate: {item.orderDate}</div>
                        </div>
                      </div>
                    </td>

                    <td className='p-4 text-sm font-normal text-gray-500 whitespace-nowrap'>
                      <span className='w-fit'><Status status={item.status} /></span>
                    </td>
                    <td className='p-4 text-md text-gray-500 whitespace-nowrap font-medium'>{helpers.numberFormat(item.totalPrice)} VND</td>
                    <td className='p-4 text-sm font-normal text-gray-500 whitespace-nowrap'>
                      <button onClick={() => { handleSetId(item.id) }}><i class="fa-regular fa-pen-to-square fa-lg"></i></button>
                    </td>
                  </tr>
                )
              })
            }
          </table>
        </div>
      </div>
    </div>
  )
}
