import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';
import { Home } from './Pages/Home';
import { SignIn } from './Pages/SignIn';
import { SignUp } from './Pages/SignUp';
import { Order } from './Pages/Order';
import { Cart } from './Pages/Cart';
import { useEffect, useState } from 'react';
import database from './Utils/handelDatabase';
import { ProductDetail } from './Pages/ProductDetail';
import { Store } from './Pages/Store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Checkout } from './Pages/Checkout';
import { Profile } from './Pages/Profile';
import { ForgotPassword } from './Pages/ForgotPassword';

function App() {
  const [productsData, setProductData] = useState([]);
  const [user, setUser] = useState({});
  const [cartData, setCartData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchCartData();
    fetchCurrentUser()
  }, [user]);

  useEffect(() => {
    handleAuth();
    fetchData();
  }, []);
  const fetchCurrentUser = async () => {
    const curUser = await database.fetchUserDataByCode(user?.uid)
    setCurrentUser(curUser)
  }
  const fetchCartData = async () => {
    const cart = await database.fetchCartData(user);
    setCartData(cart);
  };

  const fetchData = async () => {
    const products = await database.fetchProductsData();
    setProductData(products);
  };

  const handleAuth = () => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          sessionStorage.setItem('user', JSON.stringify(user));
        } else {
          setUser(null);
          sessionStorage.removeItem('user');
        }
      });
      return () => unsubscribe();
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      sessionStorage.removeItem('user'); // Remove user from sessionStorage on logout
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };
  const updateUi = () => fetchCartData();

  return (
    <div className="bg-[#f4f4f4]">
      <Header user={currentUser} cartData={cartData} handleLogout={handleLogout} />
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
            element={(user) ? <Checkout user={currentUser} cartData={cartData} /> : <Navigate to="/" />}
          />
          <Route
            path="/Cart"
            element={user ? <Cart cartData={cartData} updateUi={updateUi} user={user} /> : <Navigate to="/SignIn" />}
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
            element={!(user?.uid) ? <SignUp /> : <Navigate to="/SignIn" />}
          />
          <Route
            path="/ForgotPassword"
            element={<ForgotPassword />}
          />
          <Route
            path="/Profile"
            element={user ? <Profile user={currentUser} /> : <Navigate to="/SignIn" />}
          />
          <Route
            path={`/Store/:productId`}
            element={<ProductDetail user={user} updateUi={updateUi} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
