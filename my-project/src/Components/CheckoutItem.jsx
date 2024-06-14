import React, { useEffect, useState } from 'react'
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';

export const CheckoutItem = ({data}) => {
    const [product, setProduct] = useState(null)
    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await database.fetchProductDataByCode(data.product_id ? data.product_id : null)
            setProduct(productData)
        }
        fetchProduct()
    }, [])
    return (
        <div className='items-center mb-3 bg-white grid grid-cols-10 rounded-lg text-gray-700'>
            <div className="bg-white h-[150px] aspect-square flex justify-center items-center col-span-2">
                <img className='h-[80px] ' src={product?.images[0]} alt="" />
            </div>
            <div className=" col-span-3 text-[16px] font-medium">
                <h1>{product?.name} ({data?.version.v_name ? data?.version.v_name : ""})</h1>
                <span>Màu: {data?.color}</span>
            </div>
            <h1 className='font-medium text-[18px] col-span-2'>{helpers.numberFormat(data?.version.price*(1-data?.discount))}đ</h1>
            <div className="flex  col-span-1 text-gray-600">
                <span> X{data.quantity}</span>
            </div>
        </div>
    )
}
