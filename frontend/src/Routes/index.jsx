import { useState, useEffect } from 'react'
import CryptoJS from "crypto-js";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import AppLayout from '../components/appLayout/Layout'
// import './App.css'
import Dashboard from '../pages/Dashboard/Dashboard';
import GuestEntry from '../pages/GuestEntry/GuestEntry'
import Login from '../pages/Login/Login';
import Error from '../pages/Error/Error';
import ProtectedRoute from '../components/utils/protectedRoutes';

const secretKey = "this is my secret code";


function AppRoutes() {



    return (
        <>

            <BrowserRouter>

                <Routes>


                    <Route
                        path="/materials"
                        element={<Login />}
                    />
                    <Route
                        path="/materials/login"
                        element={<Login />}
                    />
                    <Route
                        path="/materials/error"
                        element={<Error />}
                    />

                    <Route path='/*'
                        element={
                            <ProtectedRoute>
                                <AppLayout body={<Routes>
                                    <Route
                                        path="/materials/guestEntry"
                                        element={<GuestEntry />}
                                    />
                                    <Route path="/materials/dashboard" element={<Dashboard />} />
                                </Routes>}
                                />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </BrowserRouter>
        </>
    )
}

export default AppRoutes
