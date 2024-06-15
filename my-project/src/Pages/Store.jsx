import React, { useEffect, useState } from 'react';
import { ProductItem } from '../Components/ProductItem';
import { Category } from '../Components/Category/Category';
import Loading from '../Components/Loading/Loading';

export const Store = ({ data, brandsData }) => {
    const [dataSearches, setDataSearches] = useState(null);
    const [sortDirection, setSortDirection] = useState(null); // null for no sorting, 'asc' for ascending, 'desc' for descending
    const [selectedRam, setSelectedRam] = useState([]);
    const [selectedPin, setSelectedPin] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);

    const ram = ['4GB', '6GB', '8GB', '12GB', '16GB'];
    const pin = ["3000", "4000", "5000", "6000", "7000", "8000", "10000"];

    const handleSortChange = (direction) => {
        setSortDirection(direction);
    };


    const handleRamChange = (e) => {
        const value = e.target.value;
        setSelectedRam(prevState =>
            prevState.includes(value)
                ? prevState.filter(item => item !== value)
                : [...prevState, value]
        );
    };

    const handlePinChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSelectedPin(prevState =>
            prevState.includes(value)
                ? prevState.filter(item => item !== value)
                : [...prevState, value]
        );
    };

    const sortData = (data, direction) => {
        return [...data].sort((a, b) => {
            const getPrice = item => {
                const version = item.version && item.version[0];
                return version ? version.price || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
            };

            const priceA = getPrice(a);
            const priceB = getPrice(b);

            if (direction === 'asc') {
                return priceA - priceB;
            } else if (direction === 'desc') {
                return priceB - priceA;
            } else {
                return 0; // No sorting
            }
        });
    };

    useEffect(() => {
        const name = urlParams.get('name');
        const category = urlParams.get('category');
        let filteredData = data;

        if (name) {
            const lowercaseName = name.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(lowercaseName) ||
                item.brand.toLowerCase().includes(lowercaseName)
            );
        } else if (category) {
            const lowercaseCategory = category.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.brand == lowercaseCategory
            );
        }

        if (selectedRam.length > 0) {
            filteredData = filteredData.filter(item =>
                selectedRam.includes(item.configuration.ram)
            );
        }

        if (selectedPin.length > 0) {
            filteredData = filteredData.filter(item =>
                selectedPin.includes(Number(item.configuration.capacity))
            );
        }

        if (sortDirection) {
            filteredData = sortData(filteredData, sortDirection);
        }

        setDataSearches(filteredData);
    }, [data, selectedRam, selectedPin, urlParams, sortDirection]);

    return (
        <div className='py-5'>
            <div className="container mx-auto">
                <div className="mb-5">
                    <Category brandsData={brandsData}/>
                </div>
                <div className="flex justify-between">
                    <div className="w-[200px] h-fit px-3 py-5 bg-white rounded-lg">
                        <span className='pb-3 w-full block border-b border-b-gray-200 text-gray-500'>Filter by</span>
                        <a href='/Store' className="text-[16px] text-blue-600 font-medium">Tất cả</a>
                        <div className="py-3">
                            <span className='text-[17px] font-medium'>Giá:</span>
                            <div className="flex flex-col mt-1">
                                <button onClick={() => handleSortChange('desc')} style={{color: sortDirection=='desc'? "blue":"black"}} className="flex items-center cursor-pointer">
                                    Từ cao đến thấp
                                </button>
                                <button onClick={() => handleSortChange('asc')} style={{color: sortDirection=='asc'? "blue":"black"}} className="flex items-center cursor-pointer">
                                    Từ thấp đến cao
                                </button>
                                <button onClick={() => handleSortChange(null)} style={{color: sortDirection==null? "blue":"black"}} className="flex items-center cursor-pointer">
                                    Không sắp xếp
                                </button>
                            </div>
                        </div>
                        <div className="pb-3">
                            <span className='text-[17px] font-medium'>Ram:</span>
                            <div className="">
                                {ram.map((item, index) => {
                                    return (
                                        <div key={index} className="text-[18px] my-1">
                                            <input className='scale-125 cursor-pointer' type="checkbox" value={item} name="ram" id={item} onChange={handleRamChange} />
                                            <label className=' select-none ml-4 cursor-pointer' htmlFor={item}>{item}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="pb-3">
                            <span className='text-[17px] font-medium'>Dung lượng pin:</span>
                            <div className="">
                                {pin.map((item, index) => {
                                    return (
                                        <div key={index} className="text-[18px] my-1">
                                            <input className='scale-125 cursor-pointer' type="checkbox" value={item} name="capacity" id={item} onChange={handlePinChange} />
                                            <label className=' select-none ml-4 cursor-pointer' htmlFor={item}>{item} mAh</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    {dataSearches === null ? (
                        <Loading />
                    ) : dataSearches.length > 0 ? (
                        <div className="grid grid-cols-4 2xl:grid-cols-5 gap-y-3 flex-1 ml-2 h-fit -mr-3">
                            {dataSearches.slice().reverse().map((item, index) => (
                                <ProductItem data={item} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 ml-2 h-fit flex items-center justify-center text-gray-500 text-lg">
                            Không có kết quả phù hợp
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
