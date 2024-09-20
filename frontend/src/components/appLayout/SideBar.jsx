import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

function SideBar(props) {
    const location = useLocation();

    return (
        <div
            className={props.open ? "app-sidebar sidebar-open" : "app-sidebar"}
        >
            <ul className="list-div">
                <li
                    className={`list-items ${location.pathname === '/materials/dashboard' ? "active" : ""}`}
                >
                    <Link className="link" to="/materials/dashboard">
                        <GridViewRoundedIcon sx={{ marginRight: "10px", color: "#00d25b", fontSize: "30px", padding: "7px", borderRadius: "50%", backgroundColor: "#2a2d3b" }} />
                        <p className="menu-names">Dashboard</p>
                    </Link>
                </li>
                <li
                    className={`list-items ${location.pathname === '/materials/guestEntry' ? "active" : ""}`}
                >
                    <Link className="link" to="/materials/guestEntry">
                        <PersonAddRoundedIcon sx={{ marginRight: "10px", color: "#00d8ff", fontSize: "30px", padding: "7px", borderRadius: "50%", backgroundColor: "#2a2d3b" }} />
                        <p className="menu-names">Guest Entry</p>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
