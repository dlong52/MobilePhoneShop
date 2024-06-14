import React from 'react'
import helpers from '../Utils/helpers'

export const ProductItem = (props) => {
    const data = props.data
    return (
        <div className="relative mx-[6px] rounded-lg p-5 bg-white shadow-md hover:scale-[1.01] transition-all" style={{width: props.widthItem? props.widthItem: "250px"}}>
            <div
                className="absolute w-[80px] h-[31px] bg-contain bg-no-repeat -top-[1px] flex justify-center -left-[4px]"
                style={{ backgroundImage: "url('Images/sale.png')" }}>
                <span className=" text-white font-medium text-[12px] mt-1">
                    Giảm {Math.floor(data.discount*100)}%
                </span>
            </div>
            <a className='w-full flex flex-col items-center' href={`/Store/${data.id}`}>
                <img className='h-[240px] w-full object-contain' src={data.images} alt="" />
            </a>
            <a className='text-[15px] font-medium my-3' href={`/Store/${data.id}`}>{data.name}</a>
            <div className=" my-3 flex text-[17px] font-medium">
                <span className='text-red-600'>{helpers.numberFormat((data?.version[0].price)*(1- (data?.discount)))}đ</span>
                <span className='ml-3 relative text-gray-500 cost'>{helpers.numberFormat(data?.version[0].price)}đ</span>
            </div>
        </div>
    )
}
