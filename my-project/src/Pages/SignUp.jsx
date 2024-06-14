import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import React, { useState } from 'react'
import { auth } from '../../firebaseConfig';
import helpers from '../Utils/helpers';

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const database = getDatabase();
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const usersRef = ref(database, 'Users/' + response.user.uid);
      if (response) {
        await updateProfile(response.user, {
          displayName: userName,
        });
      }
      const userData = {
        username: response.user.providerData[0].displayName,
        email: response.user.email,
        phoneNumber: "",
        address: "",
        cart: [],
        orders: [],
        created_at: helpers.getCurrentTime(),
      };
      await set(usersRef, userData);
      console.log("User information saved to the database.");
      sessionStorage.setItem('isRegistered', 'true'); // Save isRegistered status
      window.location.href = "/SignIn"; // Redirect to SignIn after registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert('Error creating user');
    }
  };

  if (isRegistered) {
    return <Navigate to="/SignIn" />;
  }

  return (
    <>
      <div className=" fixed inset-0 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-auto"
            src="Images/Logo/Logo.svg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Đăng kí
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Họ tên
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="email"
                  required
                  onChange={(e) => { setUserName(e.target.value) }}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => { setEmail(e.target.value) }}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Mật khẩu
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => { setPassword(e.target.value) }}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng kí
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Bạn đã có tài khoản?{' '}
            <a href="/SignIn" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Đăng nhập<param name="" value="" />
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
