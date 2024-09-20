import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import './Dashboard.css';
// import requestApi from "../../components/utils/axios";
import AppLayout from "../../components/appLayout/Layout";

function Dashboard() {
    return <Body />
}

function Body() {

    return (

        <div>
            dashboard
        </div>
    );
}

export default Dashboard;
