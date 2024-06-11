import React, { useEffect, useState } from 'react'
import helpers from '../Utils/helpers'
import database from '../Utils/handelDatabase'
import { child, getDatabase, ref, update } from 'firebase/database'
import { app } from '../../firebaseConfig'

export const CartItem = ({ user, data, updateUi }) => {
  const db = getDatabase(app);
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(data.quantity)

  const minusQuantity = (id) => {
    if (quantity > 1) { 
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantityInDatabase(newQuantity, id);
    }
  }
  const plusQuantity = (id) => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantityInDatabase(newQuantity, id);
  }

  const updateQuantityInDatabase = (newQuantity, id) => {
    const userCartRef = ref(db, `Users/${user.uid}/cart`);
    const itemRef = child(userCartRef, id);
    update(itemRef, { quantity: newQuantity })
      .then(() => {
        updateUi()
      })
      .catch((error) => {
        console.error("Error updating quantity: ", error);
      });
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await database.fetchProductDataByCode(data.product_id ? data.product_id : null)
      setProduct(productData)
    }
    fetchProduct()
  }, [])
  return (
    <div className='justify-between items-center mb-3 bg-white grid grid-cols-9 rounded-lg text-gray-700'>
      <div className="bg-white h-[150px] aspect-square flex justify-center items-center col-span-2">
        <img className='h-[100px] ' src={data?.images[0]} alt="" />
      </div>
      <div className=" col-span-2 text-[16px] font-medium">
        <h1>{product?.name} ({data?.version.v_name ? data?.version.v_name : ""})</h1>
        <span>Màu: {data?.color}</span>
      </div>
      <h1 className='font-medium text-[18px] col-span-2'>{helpers.numberFormat(data?.version.price)}đ</h1>
      <div className="flex  col-span-2 text-gray-600">
        <button onClick={()=>{minusQuantity(data.id)}} className=' w-[30px] aspect-square rounded-[5px] border border-gray-400 flex items-center justify-center'><i class="fa-solid fa-minus"></i></button>
        <span className='mx-2 w-[30px] aspect-square rounded-[5px] border border-gray-400 flex items-center justify-center'>{quantity}</span>
        <button onClick={()=>{plusQuantity(data.id)}} className=' w-[30px] aspect-square rounded-[5px] border border-gray-400 flex items-center justify-center'><i class="fa-solid fa-plus"></i></button>
      </div>
      <button onClick={() => { database.deleteCartItem(user, data.id, updateUi) }} className='text-red-800 col-span-1'>
        <i class="fa-solid fa-delete-left fa-xl"></i>
        </button>
    </div>
  )
}
