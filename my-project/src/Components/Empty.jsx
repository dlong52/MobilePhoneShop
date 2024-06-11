import React from 'react'

export const Empty = ({title}) => {
  return (
    <div className='w-full min-h-[500px] flex justify-center items-center'>
        <div className="flex flex-col items-center text-gray-600">
            <h1 className='text-[30px] font-semibold'>{title}</h1>
            <span className='my-2 text-[18px]'>Tiếp tục lựa chọn sản phẩm</span>
            <a className='py-3 px-5 bg-blue-700 rounded-full text-white' href="/Store">Cửa hàng</a>
        </div>
    </div>
  )
}
