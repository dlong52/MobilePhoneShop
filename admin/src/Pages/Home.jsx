import { useEffect, useState } from "react";
import helpers from "../Utils/helpers";
import { WidgetItem } from "../Components/WidgetItem";

export const Home = ({ orderData, usersData, productsData }) => {
  const [revenueToday, setRevenueToday] = useState(null);
  const [prodInStock, setProdInStock] = useState(null);
  const [productsSoldToday, setProductsSoldToday] = useState(null); // Thêm state mới

  const userToday = usersData?.filter(
    (item) => item.created_at.split(" ")[1] === helpers.getCurrentDate()
  );

  useEffect(() => {
    if (orderData) {
      let allProductsSoldToday = 0; // Khởi tạo biến để tính tổng số sản phẩm bán trong ngày
      const allProducts = orderData.reduce((acc, order) => {
        if (
          order.orderDate.split(" ")[1] === helpers.getCurrentDate() &&
          order.products &&
          order.status !== "cancelled" // Kiểm tra đơn hàng không có trạng thái cancelled
        ) {
          const productsInOrder = Object.values(order.products);
          const orderRevenue = productsInOrder.reduce((total, product) => {
            allProductsSoldToday += product.quantity; // Cộng dồn số lượng sản phẩm bán trong ngày
            return total + product.version.price * product.quantity;
          }, 0);
          acc += orderRevenue;
        }
        return acc;
      }, 0);
      setRevenueToday(allProducts);
      setProductsSoldToday(allProductsSoldToday); // Set giá trị tổng số sản phẩm bán trong ngày
    }
    setProdInStock(
      productsData.reduce(function (total, product) {
        return total + Number(product.quantity);
      }, 0)
    );
  }, [orderData, productsData]);
  const sortedProducts = productsData.sort((a, b) => b.sold - a.sold);

  // Chỉ lấy 5 mục đầu tiên
  const top5Products = sortedProducts.slice(0, 5);

  console.log(top5Products);
  return (
    <div className="w-full min-h-screen p-5">
      <div className="w-full grid grid-cols-12 gap-6 mt-5">
        <WidgetItem
          content={`${helpers.numberFormat(revenueToday / 1000000)}M`}
          title={"Today's Revenue"}
          icon={<i class="fa-solid fa-file-lines fa-xl text-blue-600"></i>}
        />
        <WidgetItem
          content={userToday?.length}
          title={"Today's User"}
          icon={<i class="fa-solid fa-user-group fa-xl text-yellow-500"></i>}
        />
        <WidgetItem
          content={productsSoldToday} // Hiển thị tổng số sản phẩm bán trong ngày
          title={"Total products sold today"}
          icon={<i class="fa-solid fa-layer-group fa-xl text-red-600"></i>}
        />
        <WidgetItem
          content={prodInStock}
          title={"In Stock"}
          icon={<i class="fa-solid fa-warehouse fa-xl text-green-600"></i>}
        />
      </div>
      <div className="mt-10">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <span className="text-[20px] font-semibold text-red-600 px-4">Top Selling Products</span>
          <table className="w-full text-left">
            <tr className=" uppercase">
              <th className="p-4 text-[12px] text-gray-500">Image</th>
              <th className="p-4 text-[12px] text-gray-500">Product Name</th>
              <th className="p-4 text-[12px] text-gray-500">Price</th>
              <th className="p-4 text-[12px] text-gray-500 text-center">Sold</th>
            </tr>
            {top5Products?.map((item, index) => {
              return (
                <tr>
                  <td className="p-4 font-medium text-left h-[60px]">
                    <a href={`Products/${item.id}`} className="h-[90px] p-[10px] aspect-square bg-main rounded-md shadow-inner flex justify-center items-center">
                      <img className="h-full" src={item.images[0]} alt="" />
                    </a>
                  </td>
                  <td className="p-4 font-semibold text-main text-left"><a href={`Products/${item.id}`}>{item.name}</a></td>
                  <td className="p-4 font-semibold text-left text-red-600 text-[18px]">{helpers.numberFormat(item.version[0].price)} VND</td>
                  <td className="p-4 font-medium text-center">{item.sold}</td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    </div>
  );
};
