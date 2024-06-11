import React, { useEffect, useState } from 'react'
import { orderRoutes } from '../Routes/order'
import database from '../Utils/handelDatabase'
import { OrderItem } from '../Components/OrderItem'
import { Empty } from '../Components/Empty'

export const Order = ({ user }) => {
  const routeStyle = 'h-[50px] w-[150px] flex justify-center items-center'
  const [routeActive, setRouteActive] = useState(0)
  const [orderData, setOrderData] = useState([])
  const [myOrderData, setMyOrderData] = useState([])
  const fetchOrderData = async () => {
    const myOrder = await database.fetchMyOrdersData(user)
    const orders = await database.fetchOrdersData()
    setOrderData(orders)
    setMyOrderData(myOrder)
  }
  useEffect(() => {
    fetchOrderData()
  }, [user])
  const myOrderIds = myOrderData.map(order => order.id)
  const allMyOrderData = orderData?.filter(order => myOrderIds.includes(order.id))

  const filteredOrders = () => {
    switch (routeActive) {
      case 0:
        return allMyOrderData;
      case 1:
        return allMyOrderData.filter(order => order.status === "processing");
      case 2:
        return allMyOrderData.filter(order => order.status === "delivered");
      case 3:
        return allMyOrderData.filter(order => order.status === "cancelled");
      default:
        return [];
    }
  }
  const updateUi = () => fetchOrderData()
  const filteredData = filteredOrders();
  return (
    <div>
      {!allMyOrderData.length==0 ?
        (<div className="container mx-auto my-3 min-h-[300px]">
          <div className="flex items-center text-[16px] border-b-2 border-gray-300 bg-white h-[50px]">
            {orderRoutes.map((route, i) => {
              return (
                <button
                  onClick={() => { setRouteActive(i) }}
                  key={i}
                  className={routeActive === i ? `${routeStyle} border-b-2 border-blue-600 text-blue-600` : routeStyle}
                >
                  {route.name}
                </button>
              )
            })}
          </div>
          <div className="">
            {
              filteredData.slice().reverse().map((item, index) => {
                return <OrderItem data={item} user={user} updateUi={updateUi} key={index} />
              })
            }
          </div>
        </div>) :
        <Empty title="Chưa có đơn hàng"/>
      }
    </div>
  )
}
