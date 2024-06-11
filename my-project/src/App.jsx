import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './Components/Header/Header'
import { Footer } from './Components/Footer/Footer'
import { Home } from './Pages/Home'
import { SignIn } from './Pages/SignIn'
import { SignUp } from './Pages/SignUp'
import { Order } from './Pages/Order'
import { Cart } from './Pages/Cart'
import { useEffect, useState } from 'react'
import database from './Utils/handelDatabase'
import { ProductDetail } from './Pages/ProductDetail'
import { Store } from './Pages/Store'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { Checkout } from './Pages/Checkout'
import Loading from './Components/Loading/Loading'
import { Profile } from './Pages/Profile'

function App() {
  const [productsData, setProductData] = useState([])
  const [user, setUser] = useState({});
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    fetchCartData();
  }, [user]);
  useEffect(() => {
    handelAuth()
    fetchData()
  }, []);
  const fetchCartData = async () => {
    const cart = await database.fetchCartData(user);
    setCartData(cart);
  };
  const fetchData = async () => {
    const products = await database.fetchProductsData()
    setProductData(products)
  }
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
  const updateUi = () => fetchCartData()
  return (
    <div className="bg-[#f4f4f4]">
      <Header user={user} cartData={cartData} handleLogout={handleLogout}/>
      <div className=''>
        <div>
          <Routes>
            <Route
              path="/"
              element={<Home products={productsData} />}
            />
            <Route
              path="/Store"
              element={<Store data={productsData} />}
            />
            <Route
              path="/Checkout"
              element={(user && cartData) ? <Checkout user={user} /> : <Navigate to="/" />}
            />
            <Route
              path="/Cart"
              element={user ? <Cart user={user} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/Orders"
              element={user ? <Order user={user} /> : <Navigate to="/SignIn" />}
            />
            <Route
              path="/SignIn"
              element={!(user?.uid) ? <SignIn /> : <Navigate to="/" />}
            />
            <Route
              path="/SignUp"
              element={!(user?.uid) ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
              path="/Profile"
              element={user ? <Profile user={user} /> : <Navigate to="/SignIn" />}
            />
            {productsData?.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={`/${item.code}`}
                  element={item.images && item ? <ProductDetail user={user} data={item} updateUi={updateUi}/> : <Loading />}
                />
              )
            })}
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default App
