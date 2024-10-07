import React from 'react';
import './GuestEntry.css';


function Tabs({ activeTab, handleTabClick }) {
    return (
        <div className="tabs">
            <div className="u-list">
                <p
                    className={activeTab === 1 ? 'active' : ''}
                    onClick={() => handleTabClick(1)}>
                    Personal Information
                </p>
                <p
                    className={activeTab === 2 ? 'active' : ''}
                    onClick={() => handleTabClick(2)}>
                    Professional Information
                </p>
            </div>
            <div style={{ marginLeft: "10px", fontWeight: '600' }}>New Guest</div>
        </div>
    );
}

export default Tabs;
