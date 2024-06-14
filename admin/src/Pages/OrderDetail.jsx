import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';
import { Status } from '../Components/Status';
export const OrderDetail = () => {
  const { orderId } = useParams();
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await database.fetchOrderDataByCode(orderId)
      setData(orderData)
    }
    fetchOrder()
  }, [orderId])
  return (
    <div className='p-5 min-h-screen'>
      <div className=" grid grid-cols-3 gap-x-3">
        <div className=" col-span-2 bg-white rounded-lg p-5">
          <div className="flex flex-col">
            <span className='text-[20px] font-semibold text-main'>Order #ID:{data?.order_id}</span>
            <span className='flex items-center gap-x-3'>
              <Status status={data?.status}/>
              {
                data?.status == 'processing' ?
                  data.orderDate :
                  data?.status == 'delivered' ?
                    data?.receivedDate :
                    data?.cancellationDate
              }
            </span>
          </div>
          <div className="py-5 border-b-2">
            <table className="w-full text-center mt-5">
              {data?.products.map((item, index) => {
                return (
                  <tr className="">
                    <td>
                      <img src={item.images[0]} className='h-[80px]' alt="" />
                    </td>
                    <td>{item.product_name} {item.version.v_name}</td>
                    <td>{helpers.numberFormat(item.version.price)} VND</td>
                    <td>X{item.quantity}</td>
                    <td>{helpers.numberFormat(item.version.price * item.quantity)} VND</td>
                  </tr>
                )
              })}
            </table>
          </div>
          <div className="my-5 text-end text-[20px] font-semibold text-red-800">
            <h1>Total payment: {helpers.numberFormat(data?.totalPrice)} VND</h1>
          </div>
        </div>
        <div className=" col-span-1 bg-white rounded-lg p-5">
          <span className='text-[20px] font-semibold text-main'>Customer</span>
          <div className="mt-4">
            <div className="flex items-center ">
              <div className="w-[60px] aspect-square rounded-full bg-blue-800 border-[4px] border-[#2b258f] flex justify-center items-center">
                <i class="fa-regular fa-user fa-2xl text-white"></i>
              </div>
              <div className="ml-[20px]">
                <h1 className='text-[20px] font-semibold'>{data?.cusName}</h1>
                <span>10 Previous Orders</span>
              </div>
            </div>
            <div className="flex mt-[40px] items-start relative">
              <div className=" mt-[1px]">
                <i className="fa-solid fa-location-dot fa-lg text-main"></i>
              </div>
              <div className="flex flex-col ml-3">
                <span className=' font-semibold'>Shipping Address</span>
                <span>{data?.address?.detailAddress}, {data?.address?.ward}, {data?.address?.district}, {data?.address?.province}</span>
              </div>
            </div>
            <div className="flex mt-[40px] items-start relative">
              <div className=" mt-[1px]">
                <i className="fa-solid fa-phone fa-lg text-main"></i>
              </div>
              <div className="flex flex-col ml-3">
                <span className=' font-semibold'>Phone Number</span>
                <span>(+84){data?.phoneNumber.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
