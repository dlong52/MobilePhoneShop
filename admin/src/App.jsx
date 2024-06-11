import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import database from './Utils/handelDatabase'
import { Sidebar } from './Components/Sidebar'
import { Home } from './Pages/Home'
import { Product } from './Pages/Product'
import { User } from './Pages/User'
import { OrderDetail } from './Pages/OrderDetail'
import { ProductDetail } from './Pages/ProductDetail'
import { Order } from './Pages/Order'
import { UserDetail } from './Pages/UserDetail'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { SignIn } from './Pages/SignIn'

function App() {
  const [productsData, setProductsData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [usersData, setUsersData] = useState([])
  const [brandsData, setBrandsData] = useState([])
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const handelAuth = () => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          sessionStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        } else {
          setUser(null);
          sessionStorage.removeItem('user');
        }
      });
      return () => unsubscribe();
    }
  }
  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      sessionStorage.removeItem('user');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };
  useEffect(() => {
    handelAuth()
    fetchData()
  }, []);
  useEffect(() => {
    fetchCurrentUser()
  },[user])
  const fetchCurrentUser = async () => {
    const currentUserData = await database.fetchUserDataByCode(user?.uid)
    setCurrentUser(currentUserData);
  }
  const fetchData = useCallback(async () => {
    try {
      const [products, brands, orders, users] = await Promise.all([
        database.fetchProductsData(),
        database.fetchBrandData(),
        database.fetchOrdersData(),
        database.fetchUsersData()
      ]);
      setProductsData(products);
      setBrandsData(brands);
      setOrdersData(orders);
      setUsersData(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  const updateUi = async () => {
    const products = await database.fetchProductsData()
    setProductsData(products)
  }
  const updateUiOrder = async () => {
    const orders = await database.fetchOrdersData()
    setOrdersData(orders)   
  }
  return (
    <div className="relative">
      <Sidebar user={user} handleLogout={()=>{handleLogout()}}/>
      <div className='w-full bg-[#f3f6fb] absolute right-0' style={{ width: "calc(100% - 250px)" }}>
        <div className="">
          <Routes>
            <Route
              path="/"
              element={user ? <Home orderData={ordersData} usersData={usersData} productsData={productsData}/> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/Products"
              element={user ? <Product data={productsData} brandsData={brandsData} updateUi={updateUi} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/Orders"
              element={user ? <Order  data={ordersData} updateUi={updateUiOrder} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/Users"
              element={user ? <User data={usersData} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/SignIn"
              element={<SignIn />}
            />
            <Route
              path="/Users/:userId"
              element={user ? <UserDetail orders={ordersData} updateUi={updateUiOrder} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/Products/:productId"
              element={user ? <ProductDetail /> : <Navigate to="/SignIn" />}
            />
            <Route
              path={`/Orders/:orderId`}
              element={user ? <OrderDetail /> : <Navigate to="/SignIn" />}
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
