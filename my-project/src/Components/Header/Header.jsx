import { routes } from '../../Routes/main';
export const Header = ({ user, cartData,handleLogout }) => {
    const routerActiveStyle = "mx-5 font-medium"
    const currentRoute = window.location.pathname
    if (window.location.pathname == "/SignIn" || window.location.pathname == "/SignUp"|| window.location.pathname == "/ForgotPassword") {
        return (<div></div>)
    } else {
        return (
            <>
                <div className="bg-white">
                    <div className='container mx-auto flex justify-between items-center h-[90px]'>
                        <a href='/' className=" text-[28px] font-bold flex items-center">
                            <img src="/Images/Logo/Logo.svg" alt="" />
                            <h1 className='ml-1 text-[#29b6f6]'>DRACO</h1>
                        </a>

                        <form action='/Store' className="flex flex-1 mx-[50px] h-[40px] rounded-full border border-gray-400">
                            <input className='pl-5 flex-1 h-full bg-transparent outline-none' name='name' type="text" placeholder='Tìm kiếm ' />
                            <button className='h-hull aspect-square rounded-full mr-2'><i class="fa-solid fa-magnifying-glass"></i></button>
                        </form>

                        <div className="flex justify-between items-center">
                            <div className="text-gray-500 mr-3 text-[16px]">
                                {
                                    user ?
                                        <div className=" relative"> 
                                            <a className='profile_link' href="/Profile">{user?.username}</a>
                                            <div className="logout_box top-[22px] hover:block bg-gray-200 absolute z-10 shadow-2xl w-[100px] rounded-md">
                                                <a className=' block p-3 rounded-md hover:text-white hover:bg-blue-500 border-b-2 border-white' href="/Profile">Tài khoản</a>
                                                <span className='p-3 block rounded-md cursor-pointer hover:text-white hover:bg-blue-500' onClick={()=>{handleLogout()}}>Đăng xuất</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="">
                                            <a href="/SignIn">Log in</a> /
                                            <a href="/SignUp"> Sign up</a>
                                        </div>
                                }

                            </div>

                            <a className='relative' href="/Cart">
                                <span className="z-2 text-[12px] absolute right-[-10px] w-[20px] aspect-square flex justify-center items-center  bg-red-600 text-white rounded-full">{cartData?.length ? cartData.length : 0}</span>
                                <img className='h-[40px]' src="/Images/Logo/cart.png" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="bg-white my-[1px]">
                    <div className="container mx-auto flex justify-center items-center h-[45px]">
                        <nav className="flex">
                            {routes.map((item, index) => {
                                return <a key={index} className={item.path == currentRoute ? `${routerActiveStyle} text-blue-700` : `${routerActiveStyle} text-gray-700`} href={item.path}>{item.name}</a>
                            })}
                            <a className='mx-5 text-orange-600 font-semibold' href="/">F<i className="fa-solid fa-bolt"></i>ASH SALE</a>
                        </nav>
                    </div>
                </div>
            </>
        )
    }
}
