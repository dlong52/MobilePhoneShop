import React, { useEffect, useState } from 'react'
import { CheckoutItem } from '../Components/CheckoutItem';
import database from '../Utils/handelDatabase';
import helpers from '../Utils/helpers';
import { FormAddress } from '../Components/FormAddress';
import Loading from '../Components/Loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Checkout = ({ user, cartData }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [isShowForm, setIsShowForm] = useState(false)

    const [address, setAddress] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)

    const [productOrder, setProductOrder] = useState(null)
    const notify = (content, type) => { toast[type](content) };
    useEffect(() => {
        const calculateTotalPrice = () => {
            const totalPrice = cartData?.reduce((acc, item) => acc + (item.version.price*(1-item.discount) * item.quantity), 0);
            setTotalPrice(totalPrice);
        };
        calculateTotalPrice();
        setProductOrder(
            cartData?.map((item) => {
                return {
                    id: item.product_id,
                    quantity: item.quantity
                }
            })
        )
    }, [cartData]);

    useEffect(() => {
        fetchCheckoutInfo()
    }, [user]);
    const showForm = () => {
        setIsShowForm(!isShowForm)
    }
    const fetchCheckoutInfo = async () => {
        const [addressData, phoneNumberData] = await Promise.all([
            database.getAddress(user),
            database.getPhone(user)
        ]);
        setAddress(addressData);
        setPhoneNumber(phoneNumberData);
    };
    const order = {
        cusName: user?.username,
        address: address,
        phoneNumber: phoneNumber,
        products: cartData,
        totalPrice: totalPrice,
        status: "processing",
        orderDate: helpers.getCurrentTime(),
    }
    console.log(address);
    const createOrder = () => {
        if (!address && !phoneNumber) {
            notify("Vui lòng nhập đầy đủ thông tin nhận hàng!", "warning")
        } else {
            database.createOrder(user, order, productOrder)
        }
    }
    const updateUi = () => {
        fetchCheckoutInfo()
    }
    return (
        <div>
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
            {!cartData?.length == 0 || phoneNumber ?
                <div className="container mx-auto my-4 flex justify-between">
                    <div className="flex-1">
                        <div className=" bg-white p-5 rounded-lg flex flex-col">
                            <span className="text-[18px] font-semibold text-orange-600">
                                <i class="fa-solid fa-location-dot fa-lg"></i> Thông tin nhận hàng
                            </span>
                            {(address && phoneNumber) ?
                                <div className="mt-3 flex">
                                    <span className=' text-[17px]'>
                                        <span className='font-semibold'>{user?.displayName} (+84){phoneNumber ? phoneNumber : ""}</span>
                                        {address && <span className='ml-2'>{address?.detailAddress}, {address?.ward}, {address?.district}, {address?.province}</span>}
                                    </span>
                                    <button onClick={showForm} className='text-blue-600 ml-[30px]'>Thay đổi</button>
                                </div> :
                                <div className='flex items-center mt-3'>
                                    <span>Vui lòng nhập thông tin nhận hàng</span>
                                    <button className='text-blue-600 ml-2 '>
                                        <i onClick={showForm} className="fa-solid fa-circle-plus fa-lg cursor-pointer"></i>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="bg-white p-5 rounded-lg mt-3">
                            <span className="text-[18px] font-semibold ">
                                Sản phẩm:
                            </span>
                            {cartData?.map((item, index) => {
                                return <CheckoutItem data={item} key={index} />
                            })}
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg w-[350px] ml-3 flex flex-col h-fit">
                        <span className='my-3 text-gray-700 text-[18px] font-medium'>Tổng thanh toán: <span className='text-[20px] font-semibold text-red-700'>{helpers.numberFormat(totalPrice)}đ</span></span>
                        <button onClick={createOrder} className='h-[40px] rounded-md bg-blue-500 text-white'>Đặt hàng</button>
                    </div>
                </div> :
                <Loading />
            }
            {isShowForm && <FormAddress user={user} showForm={showForm} updateUi={updateUi} phoneNumberData={phoneNumber} />}
        </div>
    )
}
