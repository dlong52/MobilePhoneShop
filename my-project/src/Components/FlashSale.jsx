import React, { useEffect, useRef, useState } from 'react'
import { ProductItem } from './ProductItem'
import Loading from './Loading/Loading'

export const FlashSale = ({ data }) => {
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [currentOffset, setCurrentOffset] = useState(0)

    const updateContainerWidth = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth)
        }
    }

    useEffect(() => {
        updateContainerWidth()
        window.addEventListener('resize', updateContainerWidth)
        return () => window.removeEventListener('resize', updateContainerWidth)
    }, [])

    const widthItem = (containerWidth - 60) / 5
    const distance = widthItem + 12
    const handleNext = () => {
        const maxOffset = -(distance * (data.length - 5))
        if (currentOffset - distance >= maxOffset) {
            setCurrentOffset(currentOffset - distance)
        } else {
            setCurrentOffset(maxOffset)
        }
    }
    const handlePrev = () => {
        if (currentOffset + distance <= 0) {
            setCurrentOffset(currentOffset + distance)
        } else {
            setCurrentOffset(0)
        }
    }

    if (!data) {
        return <Loading />
    } else {
        return (
            <div className="my-[45px]">
                <h1 className="text-[25px] text-orange-500 font-bold my-1">
                    F<i className="fa-solid fa-bolt"></i>ASH SALE ONLINE
                </h1>
                <div className='bg-blue-950 rounded-lg px-[12px] py-[18px] relative'>
                    <div ref={containerRef} className="overflow-hidden relative">
                        <div className="flex w-fit transition-transform duration-300" style={{ transform: `translateX(${currentOffset}px)` }}>
                            {data.map((item, index) => (
                                <ProductItem data={item} widthItem={widthItem} key={index} />
                            ))}
                        </div>
                    </div>
                    <div className="direction w-full flex justify-between absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <button onClick={handlePrev} className='w-[40px] aspect-square rounded-full bg-gray-200 text-gray-600'>
                            <i className="fa-solid fa-chevron-left fa-lg"></i>
                        </button>
                        <button onClick={handleNext} className='w-[40px] aspect-square rounded-full bg-gray-200 text-gray-600'>
                            <i className="fa-solid fa-chevron-right fa-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
