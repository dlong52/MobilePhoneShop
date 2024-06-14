import React, { useEffect, useState } from 'react'
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';

export const OrderItem = ({ data, user, updateUi }) => {
    const products = data.products
    const confirmCancelOrder = () =>{
        if(window.confirm("Xác nhận hủy đơn hàng này" )){
            database.cancelMyOrder(user, data.id, updateUi)
        }
    }
    return (
        <div className="my-3 bg-white p-2">
            <div className="pb-2 border-b border-blue-200 text-blue-400 text-[14px] font-medium">
                <span>Ngày đặt: {data.orderDate}</span>
            </div>
            <div className="flex mt-1">
                <div className="flex-1">
                    {
                        products.map((product, index) => {
                            return (
                                <div key={index} className='items-center border mb-3 grid grid-cols-10 rounded-lg text-gray-700'>
                                    <div className="bg-white h-[150px] aspect-square flex justify-center items-center col-span-2">
                                        <img className='h-[80px]' src={product?.images[0]} alt="" />
                                    </div>
                                    <div className=" col-span-3 text-[16px] font-medium">
                                        <h1>{product?.product_name} ({product?.version.v_name ? product?.version.v_name : ""})</h1>
                                        <span>Màu: {product?.color}</span>
                                    </div>
                                    <h1 className='font-medium text-[18px] col-span-2'>{helpers.numberFormat(product?.version.price)}đ</h1>
                                    <div className="flex col-span-1 text-gray-600">
                                        <span> X{product.quantity}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="flex flex-col w-[250px] px-3 text-[16px] text-gray-500">
                    <span className='font-medium'>Trạng thái:
                        <span
                            className={data?.status == "processing" ? "text-orange-600 ml-1" : data?.status == "delivered" ? "text-green-600 ml-1" : "text-red-600 ml-1"}
                        >
                            {data?.status == "processing" ? "Đang xử lý" : data?.status == "delivered" ? "Đã giao" : "Đã hủy"}
                        </span>
                    </span>
                    <span className=" font-medium mt-3">Thành tiền: <span className='text-[20px] font-semibold text-red-600'>{helpers.numberFormat(data.totalPrice)}đ</span></span>
                    {!(data?.status == "cancelled" || data?.status == "delivered") &&
                        <button onClick={confirmCancelOrder} className='w-full h-[40px] rounded-md bg-red-600 mt-3 text-white' >Hủy đơn hàng</button>
                    }
                </div>
            </div>
        </div >
    )
}
