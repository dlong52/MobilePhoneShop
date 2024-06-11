import React, { useEffect, useState, version } from 'react'
import { useParams } from 'react-router-dom';
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers'
import Loading from '../Components/Loading/Loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const ProductDetail = () => {
  const { productId } = useParams();
  const [data, setData] = useState(null)
  const itemImageStyle = "w-[90px] aspect-square object-cover bg-white rounded-lg p-2 mr-4 border-2 flex justify-center"
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await database.fetchProductDataByCode(productId)
      setData(productData)
    }
    fetchProduct()
  }, [productId])

  const [indexActive, setIndexActive] = useState(0)

  const notify = (content, type) => { toast[type](content) };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexActive((prevIndex) => (prevIndex + 1) % data.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data?.images.length]);


  return (
    <div className="min-h-screen p-5">
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
        <div className='grid grid-cols-6 gap-5 bg-white p-5 rounded-lg shadow-lg'>
          <div className=" col-span-2">
            <div className='w-full aspect-square flex justify-center items-center border-2 border-[#100e3d] rounded-lg'>
              <img className='h-5/6 object-cover' src={data.images[indexActive]} alt="" />
            </div>
            <ul className='flex mt-4'>
              {data?.images.map((item, index) => {
                return (
                  <li onClick={() => { setIndexActive(index) }} className={indexActive == index ? `${itemImageStyle} border-[#100e3d]` : itemImageStyle} key={index}>
                    <img className='h-full object-cover' src={item} alt="" />
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="col-span-4">
            <div className="p-4 mb-3">
              <h1 className='text-[20px] font-bold'>{data.name}</h1>
              <h1 className='text-[20px] font-bold'>{helpers.numberFormat(data.version[0].price)} VND</h1>
            </div>
            <div className="p-4 mb-3">
              <div className="flex mb-3">
                <span className="w-[100px]">Brand</span>
                <span>{data?.brand}</span>
              </div>
              {data.version[0].v_name != "" &&
                <div className="flex mb-3">
                  <span className='w-[100px]'>Version</span>
                  <div className="">
                    {data.version.map((item, index) => {
                      return (
                        <div className="">
                          <span>{item.v_name}</span>
                          <span className='ml-3'>{helpers.numberFormat(item.price)}VND</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              }
              {data.colors &&
                <div className="flex mb-3">
                  <span className='w-[100px]'>Color</span>
                  <div className="">
                    {
                      data.colors.map((item, index) => {
                        return (
                          <span className=''>{item}, </span>
                        )
                      })
                    }
                  </div>
                </div>
              }
              {data.configuration &&
                <div className="">
                  <div className="flex mb-3">
                    <span className='w-[100px]'>Ram</span>
                    <span>{data.configuration.ram} GB</span>
                  </div>
                  <div className="flex mb-3">
                    <span className='w-[100px]'>Screen</span>
                    <span>{data.configuration.screen} inch</span>
                  </div>
                  <div className="flex mb-3">
                    <span className='w-[100px]'>Capacity</span>
                    <span>{data.configuration.capacity} mAh</span>
                  </div>
                </div>
              }
            </div>
            <div className="p-4 mb-3">
              <div className="flex">
                <span className="w-[100px]">Quantity</span>
                <span>{data?.quantity}</span>
              </div>
              <div className="flex">
                <span className="w-[100px]">Sold</span>
                <span>{data.sold?data.sold:0}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <span className='text-[15px] font-semibold'>Mô tả: </span><br />
              <p className='text-gray-700 leading-7 text-[14px]'>{data.description}</p>
            </div>
          </div>
        </div> :
        <Loading />
      }
    </div>
  )
}
