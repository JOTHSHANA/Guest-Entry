import React, { useState, useEffect } from "react";
import "./Error.css";
import { Link } from "react-router-dom";
import error from "../../assets/error.png"
import CustomizedSwitches from "../../components/appLayout/toggleTheme";
function Error() {

    return (
        <div className="error-page">
            <div style={{ display: "none" }}><CustomizedSwitches /></div>
            <div className="error-card">
                {/* <img style={{ height: "60%" }} src={error} alt="404" className="error-img" /> */}
                <h1 style={{ fontSize: "200px" }}>404</h1>
                <p
                    style={{
                        margin: "0px",
                        color: "gray",
                        fontWeight: "700",
                        fontSize: "20px"
                    }}
                >
                    OOPS! PAGE NOT FOUND
                </p>
                <Link style={{ fontWeight: "700" }} to="/materials/dashboard">
                    BACK TO DASHBOARD
                </Link>
            </div>
        </div>
    );
}

export default Error;
