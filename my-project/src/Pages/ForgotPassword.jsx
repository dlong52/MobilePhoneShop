import React, { useState } from 'react';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Please check your email for password reset instructions.");
        } catch (error) {
            console.error(error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto w-auto"
                    src="Images/Logo/Logo.svg"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Gửi thông báo xác nhận đổi mật khẩu
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleResetPassword} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Gửi
                        </button>
                    </div>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-500">
                        {message}
                    </p>
                )}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Quay lại đăng nhập?
                    <a href="/SignUp" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
};
