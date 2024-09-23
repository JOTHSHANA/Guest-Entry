import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CustomizedSwitches from "./toggleTheme";
import Cookies from "js-cookie";
import apiHost from "../utils/api";
import axios from "axios";
import CryptoJS from "crypto-js";
import requestApi from "../utils/axios";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getDecryptedCookie } from "../utils/encrypt";


function getIconComponent(iconPath) {
    switch (iconPath) {
        case 'GridViewRoundedIcon':
            return <GridViewRoundedIcon sx={{ marginRight: "10px", color: "#00d25b", fontSize: "32px", padding: "7px", borderRadius: "30%", backgroundColor: "var(--icons-bg)", border: "1px solid var(--border-color)" }} />;
        case 'PersonAddRoundedIcon':
            return <PersonAddRoundedIcon sx={{ marginRight: "10px", color: "#a63928", fontSize: "32px", padding: "7px", borderRadius: "30%", backgroundColor: "var(--icons-bg)", border: "1px solid var(--border-color)" }} />;
        default:
            return null;
    }
}

function SideBar(props) {
    const [activeItem, setActiveItem] = useState("");
    const [sidebarItems, setSidebarItems] = useState([]);
    const location = useLocation();
    const sidebarRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchSidebarItems = async () => {
            try {
                const role = getDecryptedCookie("role");

                if (!role) {
                    navigate('/materials/login');
                    return;
                }
                const response = await requestApi("GET", `/api/resources?role=${role}`);

                if (response.status === 400) {
                    navigate("/materials/login");
                    return;
                }

                if (response.success) {
                    setSidebarItems(response.data);
                } else {
                    console.error("Error fetching sidebar items:", response.error);
                    navigate("/materials/login");
                }
            } catch (error) {
                console.error("Error fetching sidebar items:", error);
                navigate("/materials/login");
            }
        };

        fetchSidebarItems();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                props.handleSideBar(); // Close the sidebar if clicked outside
            }
        };

        if (props.open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.open]);


    return (
        <div
            className={props.open ? "app-sidebar sidebar-open" : "app-sidebar"}
        >
            <ul className="list-div">
                {sidebarItems.map(item => (
                    <li
                        key={item.path}
                        className={`list-items ${location.pathname.startsWith(item.path) ? "active" : ""}`}
                        onClick={() => { setActiveItem(item.name); props.handleSideBar(); }}

                    >
                        <Link className="link" to={item.path}>
                            {getIconComponent(item.icon_path)}
                            <p className="menu-names">{item.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideBar;
