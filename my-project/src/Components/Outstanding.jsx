import React, { useEffect, useRef, useState } from 'react'
import { ProductItem } from './ProductItem'

export const Outstanding = ({ data }) => {
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)

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
    return (
        <div className=''>
            <h1 className='uppercase text-[25px] text-orange-500 font-bold my-1'>Sản phẩm nổi bật</h1>
            <div ref={containerRef} className="">
                <div className="grid grid-cols-5 gap-y-3 -mx-[10px]">
                    {
                        data.slice().reverse().map((item, index) => {
                            return <ProductItem data={item} widthItem={widthItem} key={index} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}
