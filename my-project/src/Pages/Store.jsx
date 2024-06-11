import React, { useEffect, useState } from 'react'
import { ProductItem } from '../Components/ProductItem'
import { Category } from '../Components/Category/Category'
import Loading from '../Components/Loading/Loading'

export const Store = ({ data }) => {
    const [dataSearches, setDataSearches] = useState([])
    const [sort, setSort] = useState(false)
    const [toUp, setToUp] = useState(false)
    const [toDown, setToDown] = useState(false)
    const handelToDown = () => {
        if (toUp) {
            setToUp(false)
            setToDown(!toDown)
        } else {
            setToDown(!toDown)
        }
    }
    const handelToUp = () => {
        if (toDown) {
            setToDown(false)
            setToUp(!toUp)
        } else {
            setToUp(!toUp)
        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const category = urlParams.get('category');
        if (name) {
            const lowercaseName = name.toLowerCase();
            setDataSearches(data.filter(item =>
            (item.name.toLowerCase().includes(lowercaseName) ||
                (item.brand.toLowerCase().includes(lowercaseName))
            )));
        }
        if (category) {
            const lowercaseName = category.toLowerCase();
            setDataSearches(data.filter(item => (item.brand.toLowerCase().includes(lowercaseName))));
        }
    }, [data]);
    return (
        <div className='py-5'>
            {/* {(!data.length == 0 || !dataSearches.length == 0) ? */}
                (<div className="container mx-auto">
                    <div className="mb-5">
                        <Category />
                    </div>
                    <div className="flex justify-between">
                        <div className="w-[200px] h-fit px-3 py-5 bg-white rounded-lg">
                            <span className='pb-3 w-full block border-b border-b-gray-200 text-gray-500'>Filter by</span>
                            <a href='/Store' className="text-[16px] text-blue-600 font-medium">Tất cả</a>
                            <div className="py-3">
                                <span className='text-[17px] font-medium'>Giá:</span>
                                <div className="flex flex-col mt-1">
                                    <div onClick={handelToDown} className="flex items-center cursor-pointer">
                                        <div
                                            className="mr-3 border-[2px] w-[18px] h-[18px] rounded-full border-gray-400"
                                            style={{ background: toDown ? "blue" : "white" }}
                                        ></div>
                                        <span className=' select-none'>Từ cao đến thấp</span>
                                    </div>
                                    <div onClick={handelToUp} className="flex items-center cursor-pointer">
                                        <div
                                            className="mr-3 border-[2px] w-[18px] h-[18px] rounded-full border-gray-400"
                                            style={{ background: toUp ? "blue" : "white" }}
                                        ></div>
                                        <span className=' select-none'>Từ thấp đến cao</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(!data.length == 0 || !dataSearches.length == 0) ?
                            <div className="grid grid-cols-4 gap-y-3 flex-1 ml-2 h-fit">
                                {
                                    (dataSearches.length > 0 ? dataSearches : data).map((item, index) => {
                                        return <ProductItem data={item} key={index} />
                                    })}
                            </div>:
                            <Loading/>
                        }
                    </div>
                </div>) 
        </div>
    )
}
