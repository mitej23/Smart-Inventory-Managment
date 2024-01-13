import React from 'react'
import Sidebar from '../components/Sidebar'


function Layout({ children }) {
    return (
        <div className=''>
            <Sidebar />
            <div className='h-max grow ml-[250px] p-12'>
                {children}
            </div>
        </div>
    )
}

export default Layout
