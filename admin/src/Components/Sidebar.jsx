import React from 'react'
import { routes } from '../Routes/main'

export const Sidebar = ({ user, handleLogout }) => {
  const routeAcctiveStyle = "my-3 flex items-center px-3 py-2 rounded-md"
  const currentPath = window.location.pathname
  const Logout = ()=>{
    if (confirm('Are you sure you want to log')){
      handleLogout()
    }
  }
  if (currentPath == "/SignIn")
    return false
  else {
    return (
      <div className=' fixed top-0 bottom-0 left-0 w-[250px] bg-[#100e3d] p-5'>
        <div className=" flex items-center">
          <img src="/Images/Logo/Logo.svg" alt="" />
          <h1 className='text-[25px] text-[#29b6f6] font-bold ml-2'>DracoStore</h1>
        </div>
        <div className="flex flex-col mt-[40px]">
          {routes.map((route, index) => {
            return (
              <a
                href={route.path}
                key={index}
                className={route.path == currentPath ? `${routeAcctiveStyle} bg-blue-700 text-white` : `${routeAcctiveStyle} text-gray-400`}
              >
                {route.icon}
                <span className='ml-[20px]' >{route.name}</span>
              </a>
            )
          })}
        </div>
        <div className="w-full absolute left-0 bottom-[40px] px-5">
          <button onClick={Logout} className='w-full h-[40px] rounded-md bg-blue-950 text-[#29b6f6]'><i class="fa-solid fa-right-from-bracket"></i> Log out</button>
        </div>
      </div>
    )
  }
}
