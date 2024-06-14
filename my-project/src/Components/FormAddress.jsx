import React, { useEffect, useState } from 'react'
import address from '../Utils/handelAddress'
import database from '../Utils/handelDatabase'

export const FormAddress = ({user,showForm, updateUi, phoneNumberData}) => {
    const [province, setProvince] = useState(null)
    const [district, setDistrict] = useState(null)
    const [ward, setWard] = useState(null)
    const [detailAddress, setDetailAddress] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberData?phoneNumberData:null)

    const [provinceData, setProvinceData] = useState(null)
    const [districtData, setDistrictData] = useState(null)
    const [wardData, setWardData] = useState(null)

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const provincesData = await address.fetchProvincesData();
                setProvinceData(provincesData);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvince();
    }, []);
    useEffect(() => {
        const fetchDistricts = async () => {
            if (province) {
                try {
                    const districtsData = await address.fetchDistrictData(JSON.parse(province).province_id)
                    setDistrictData(districtsData);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            }
        }; 
        fetchDistricts();
    }, [province]);

    useEffect(() => {
        const fetchWards = async () => {
            if (district) {
                try {
                    const wardsData = await address.fetchWardData(JSON.parse(district).district_id);
                    setWardData(wardsData);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            }
        };
        fetchWards();
    }, [district]);

    const addressData = {
        province: JSON.parse(province)?.province_name,
        district: JSON.parse(district)?.district_name,
        ward: JSON.parse(ward)?.ward_name,
        detailAddress: detailAddress
    }
    const saveInfo = (e) => {
        e.preventDefault();
        database.createAddress(user, addressData)
        database.savePhoneNumber(user, phoneNumber)
        updateUi()
        showForm()
    }
    console.log(provinceData);
    return (
        <div className='fixed inset-0'>
            <div onClick={()=>{showForm()}} className=" absolute inset-0 bg-[#64646460]"></div>
            <form onSubmit={(e)=>{saveInfo(e)}} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-5 px-8 rounded-lg' action="">
                <h1 className='text-[18px] text-orange-600 font-semibold'>Thông tin nhận hàng</h1>
                <div className="flex flex-col my-3 w-full">
                    <label htmlFor="">Tỉnh/Thành phố:</label>
                    <select onChange={(e) => { setProvince(e.target.value) }} className=' pl-2 outline-none w-[300px] h-[40px] border border-gray-500 rounded-[5px] mt-1' name="" id="">
                        <option value="">Tỉnh/Thành phố</option>
                        {provinceData?.map((item, index) => {
                            const copyVal = JSON.stringify(item)
                            return <option key={index} value={copyVal} >{item.province_name}</option>
                        })}
                    </select>
                </div>
                <div className="flex flex-col my-3 w-full">
                    <label htmlFor="">Quận/Huyện:</label>
                    <select onChange={(e) => { setDistrict(e.target.value) }} className=' pl-2 outline-none w-[300px] h-[40px] border border-gray-500 rounded-[5px] mt-1' name="" id="">
                        <option value="">Quận/Huyện</option>
                        {districtData?.map((item, index) => {
                            const copyVal = JSON.stringify(item)
                            return <option key={index} value={copyVal}>{item.district_name}</option>
                        })}
                    </select>
                </div>
                <div className="flex flex-col my-3 w-full">
                    <label htmlFor="">Phường/Xã:</label>
                    <select onChange={(e) => { setWard(e.target.value) }} className=' pl-2 outline-none w-[300px] h-[40px] border border-gray-500 rounded-[5px] mt-1' name="" id="">
                        <option value="">Phường/Xã</option>
                        {wardData?.map((item, index) => {
                            const copyVal = JSON.stringify(item)
                            return <option key={index} value={copyVal}>{item.ward_name}</option>
                        })}
                    </select>
                </div>
                <div className="flex flex-col my-3 w-full">
                    <label htmlFor="">Địa chỉ cụ thể:</label>
                    <input placeholder='Địa chỉ cụ thể' onChange={(e) => { setDetailAddress(e.target.value) }} className=' pl-2 outline-none w-[300px] h-[40px] border border-gray-500 rounded-[5px] mt-1' type="text" />
                </div>
                <div className="flex flex-col my-3 w-full">
                    <label htmlFor="">Số điện thoại:</label>
                    <input defaultValue={phoneNumberData? phoneNumberData : null} placeholder='Số điện thoại' onChange={(e) => { setPhoneNumber(e.target.value) }} className=' pl-2 outline-none w-[300px] h-[40px] border border-gray-500 rounded-[5px] mt-1' type="text" />
                </div>
                <div className="flex justify-end mt-3 w-full">
                    <button onClick={()=>{showForm()}} type='button' className='w-[80px] h-[40px] rounded-[5px] text-white bg-gray-600 mr-3'>Hủy</button>
                    <button className='w-[80px] h-[40px] rounded-[5px] text-white bg-blue-600'>Xác nhận</button>
                </div>
            </form>
        </div>
    )
}
