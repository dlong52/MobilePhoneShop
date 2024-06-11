import React from 'react'
import categoryRoutes from '../../Routes/categoty'
import { CategoryItem } from './CategoryItem'

export const Category = () => {
    return (
        <div className='flex -mx-2'>
            {categoryRoutes.map(category => {
                return <CategoryItem data={category}/>
            })}
        </div>
    )
}
