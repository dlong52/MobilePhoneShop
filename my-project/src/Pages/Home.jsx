import React from 'react'
import { Banner } from '../Components/Banner'
import { Category } from '../Components/Category/Category'
import { FlashSale } from '../Components/FlashSale'
import { Outstanding } from '../Components/Outstanding'
import Loading from '../Components/Loading/Loading'

export const Home = ({ products, brandsData }) => {
  console.log(brandsData);
  return (
    <div className='container mx-auto py-5'>
      <Banner />
      <div className="mt-[45px]">
        <Category brandsData={brandsData} />
      </div>
      {!products.length == 0 ?
        <div className="">
          <FlashSale data={products} />
          <Outstanding data={products} />
        </div> :
        <Loading />
      }
    </div>
  )
}
