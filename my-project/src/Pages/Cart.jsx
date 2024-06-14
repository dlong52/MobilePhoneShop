import React, { useEffect, useState } from 'react';
import { CartItem } from '../Components/CartItem';
import helpers from '../Utils/helpers';
import { Empty } from '../Components/Empty';
import Loading from '../Components/Loading/Loading';

export const Cart = ({ cartData, updateUi, user }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        const calculateTotalPrice = () => {
            const totalPrice = cartData?.reduce((acc, item) => acc + (item.version.price*(1-item.discount) * item.quantity), 0);
            setTotalPrice(totalPrice);
        };
        if (cartData) {
            calculateTotalPrice();
        }
    }, [cartData]);
    return (
        <div className='container mx-auto'>
            {cartData == null ? (
                <Loading />
            ) : cartData?.length == 0 ? (
                <Empty title="Giỏ hàng trống"/>
            ) : (
                <div>
                    <h1 className='text-[20px] font-medium text-gray-600 my-2'>Giỏ hàng ({cartData?.length})</h1>
                    <div className="flex">
                        <div className="flex-1">
                            {cartData?.map((item, index) => (
                                <CartItem user={user} data={item} updateUi={updateUi} key={index} />
                            ))}
                        </div>
                        <div className="w-[300px] bg-white ml-3 rounded-lg mb-3 p-3 h-fit">
                            <div>
                                <h1 className='mb-3 text-[17px] font-medium text-gray-700'>Tổng giá trị: <span className='text-red-700 text-[18px] ml-1'>{helpers.numberFormat(totalPrice)}đ</span></h1>
                                <h1 className='mb-3 text-[17px] font-medium text-gray-700'>Giảm giá: 0%</h1>
                                <h1 className='mb-3 text-[17px] font-medium text-gray-700'>Tổng thanh toán: <span className='text-red-700 text-[18px] ml-1'>{helpers.numberFormat(totalPrice)}đ</span></h1>
                            </div>
                            <a href='/Checkout' className='w-full flex justify-center items-center text-white rounded-[5px] h-[40px] bg-red-500 my-2'>Mua hàng</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
