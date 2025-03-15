import NavbarComponent from '@/Components/Navbar';
import React from 'react'
import styles from "./style.module.css";
 

function Userlayout({ children }) {

    return (
        <div>
            <NavbarComponent />
            {children}
        </div>
    )
}

export default Userlayout;