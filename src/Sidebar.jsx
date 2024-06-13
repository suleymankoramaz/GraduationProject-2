import React from 'react';
import { Link } from 'react-router-dom';
import {
    BsGrid1X2Fill,
    BsFillArchiveFill,
    BsFillGrid3X3GapFill,
    BsPeopleFill,
    BsListCheck,
    BsMenuButtonWideFill,
    BsFillGearFill
} from 'react-icons/bs';

import { CiHome } from "react-icons/ci";
import { AiOutlineStock } from "react-icons/ai";
import { MdImageSearch } from "react-icons/md";
import './App.css';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    BORSA GTU
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <Link to="/">
                    <li className='sidebar-list-item'>
                        <CiHome className='icon' /> Home
                    </li>
                </Link>
                <Link to="/stocks">
                    <li className='sidebar-list-item'>
                        <AiOutlineStock className='icon' /> Stocks
                    </li>
                </Link>
                <Link to="/analysis">
                    <li className='sidebar-list-item'>
                        <MdImageSearch className='icon' /> Analysis
                    </li>
                </Link>
            </ul>
        </aside>
    );
}

export default Sidebar;
