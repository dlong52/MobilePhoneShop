import React, { useEffect, useState } from 'react'
import helpers from '../Utils/helpers'
import database from '../Utils/handelDatabase'
import Loading from '../Components/Loading/Loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const ProductDetail = ({ user, data, updateUi }) => {
  const [indexActive, setIndexActive] = useState(0)
  const [indexColorActive, setIndexColorActive] = useState(0)
  const [indexVersionActive, setIndexVersionActive] = useState(0)

  const [selectedVersion, setSelectedVersion] = useState(data.version[0])
  const [selectedColor, setSelectedColor] = useState(data.colors[0])

  const itemImageStyle = "w-[90px] aspect-square object-cover bg-white rounded-lg p-2 mr-4 border-2 flex justify-center"
  const itemVersionStyle = "mr-3 px-4 rounded-md border-2 border-gray-300 cursor-pointer"
  const itemColorStyle = "mr-3 px-4 rounded-md border-2 border-gray-300 cursor-pointer font-medium text-[13px]"
  const notify = (content, type) => { toast[type](content) };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexActive((prevIndex) => (prevIndex + 1) % data.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data.images.length]);

  const itemAddToCart = {
    product_id: data.id,
    product_name: data.name,
    images: data.images,
    version: selectedVersion,
    color: selectedColor,
    quantity: 1,
  }
  const addToCart = () => {
    if(user){
      database.addToCart(itemAddToCart, user, notify, updateUi)
    }else{

    }
  }
  return (
    <div className="container mx-auto min-h-[500px]">
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
      {data && data.images ?
        <div className='grid grid-cols-7 gap-5 my-10'>
          <div className=" col-span-2">
            <div className='w-full aspect-square flex justify-center items-center bg-white rounded-lg'>
              <img className='h-5/6 object-cover' src={data.images[indexActive]} alt="" />
            </div>
            <ul className='flex mt-4'>
              {data.images.map((item, index) => {
                return (
                  <li onClick={() => { setIndexActive(index) }} className={indexActive == index ? `${itemImageStyle} border-blue-600` : itemImageStyle} key={index}>
                    <img className='h-full object-cover' src={item} alt="" />
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="col-span-3">
            <div className="p-4 bg-white rounded-lg mb-4">
              <h1 className='text-[20px] font-bold'>{data.name}</h1>
              {data.version[0].v_name == "" ?
                <h1 className="text-[25px] font-medium text-red-600">{helpers.numberFormat(data.version[0].price)}đ</h1> :
                <div className="">
                  <span className='text-[15px] font-semibold'>Lựa chọn phiên bản: </span><br />
                  <div className="flex mt-2">
                    {data.version.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => { setIndexVersionActive(index); setSelectedVersion(item) }}
                          className={index == indexVersionActive ? `${itemVersionStyle} bg-blue-700 text-white` : itemVersionStyle}>
                          <span className='font-bold'>{item.v_name}</span><br />
                          <span className='font-semibold'>{helpers.numberFormat(item.price)}đ</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              }
            </div>
            <div className="mt-5 p-4 bg-white rounded-lg">
              <span className='text-[15px] font-semibold'>Lựa chọn màu: </span><br />
              <div className="flex mt-2">
                {data.colors.map((item, index) => {
                  return (
                    <div key={index} onClick={() => { setIndexColorActive(index); setSelectedColor(item) }} className={index == indexColorActive ? `${itemColorStyle} bg-blue-600 text-white` : itemColorStyle}>
                      <span className=''>{item}</span><br />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <span className='text-[15px] font-semibold'>Mô tả: </span><br />
              <p className='text-gray-700 leading-7 text-[14px]'>{data.description}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white p-5 rounded-lg">
              <div className="">
                <span className='font-medium'>Tạm tính:</span><br />
                <span className='font-semibold text-[20px] mt-2 text-red-700'>{helpers.numberFormat(selectedVersion.price)}đ</span>
              </div>
              <div className="flex flex-col mt-4">
                <button onClick={addToCart} className='text-white rounded-[5px] h-[40px] bg-blue-500 my-2'>Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div> :
        <Loading />
      }
    </div>
  )
}
