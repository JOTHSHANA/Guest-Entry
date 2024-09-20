import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import './GuestEntry.css';
// import requestApi from "../../components/utils/axios";

function GuestEntry() {
    return <Body />
}

function Body() {
    
    return (
        <>
            guest
        </>
    );
}

export default GuestEntry;
