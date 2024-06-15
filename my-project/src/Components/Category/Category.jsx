import React from 'react'
import categoryRoutes from '../../Routes/categoty'
import { CategoryItem } from './CategoryItem'

export const Category = ({brandsData}) => {
    return (
        <div className='flex -mx-2'>
            {brandsData?.map(category => {
                return <CategoryItem data={category}/>
            })}
        </div>
    )
}
