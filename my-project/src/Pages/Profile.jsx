import React, { useEffect, useState } from 'react'
import database from '../Utils/handelDatabase';
import { FormAddress } from '../Components/FormAddress';

export const Profile = ({ user }) => {
    const [address, setAddress] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [isShowForm, setIsShowForm] = useState(false)
    useEffect(() => {
        fetchCheckoutInfo()
    }, [user]);
    const fetchCheckoutInfo = async () => {
        const [addressData, phoneNumberData] = await Promise.all([
            database.getAddress(user),
            database.getPhone(user)
        ]);
        setAddress(addressData);
        setPhoneNumber(phoneNumberData);
    };
    const showForm = () => {
        setIsShowForm(!isShowForm)
    }
    const updateUi = () => {
        fetchCheckoutInfo()
    }
    return (
        <div className='container mx-auto my-3 flex justify-center'>
            {isShowForm && <FormAddress user={user} showForm={showForm} updateUi={updateUi} phoneNumberData={phoneNumber} />}
            <div className="w-fit bg-white py-5 px-[100px] rounded-lg">
                <div className="flex items-center ">
                    <div className="w-[80px] aspect-square rounded-full bg-blue-200 border-[4px] border-blue-300 flex justify-center items-center">
                        <i class="fa-regular fa-user fa-2xl text-blue-500"></i>
                    </div>
                    <div className="ml-[20px] text-[25px] text-gray-500 font-medium">
                        <span className='text-gray-700'>{user?.displayName}</span><br />
                        <span className='text-gray-600 text-[15px]'>{user?.email}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <div className=" flex justify-between mb-3">
                        <span className='text-gray-400 text-[14px] font-medium'>Thông tin địa chỉ</span>
                        <button onClick={showForm}><i class="fa-solid fa-pen-to-square text-blue-600 fa-lg"></i></button>
                    </div>
                    <div className="flex items-center text-[18px] mb-4">
                        <span className='font-medium mr-3 text-[16px] w-[150px] text-gray-700'>Tỉnh/Thành phố: </span>
                        <span className='font-semibold'>{address?.province}</span>
                    </div>
                    <div className="flex items-center text-[18px] mb-4">
                        <span className='font-medium mr-3 text-[16px] w-[150px] text-gray-700'>Quận/Huyện: </span>
                        <span className='font-semibold'>{address?.district}</span>
                    </div>
                    <div className="flex items-center text-[18px] mb-4">
                        <span className='font-medium mr-3 text-[16px] w-[150px] text-gray-700'>Phường/Xã: </span>
                        <span className='font-semibold'>{address?.ward}</span>
                    </div>
                    <div className="flex items-center text-[18px] mb-4">
                        <span className='font-medium mr-3 text-[16px] w-[150px] text-gray-700'>Địa chỉ cụ thể: </span>
                        <span className='font-semibold'>{address?.detailAddress}</span>
                    </div>
                    <div className="flex items-center text-[18px] mb-4">
                        <span className='font-medium mr-3 text-[16px] w-[150px] text-gray-700'>Số điện thoại: </span>
                        <span className='font-semibold'>{phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
