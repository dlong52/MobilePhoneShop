import React from 'react'

export const CategoryItem = ({data}) => {
  return (
  <a href={`${data.path}`} className='flex justify-center items-center h-[50px] rounded-lg flex-1 mx-2 bg-white'>
        <img src={data.image} alt="" />
    </a>
  )
}
