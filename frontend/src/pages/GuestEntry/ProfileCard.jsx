import React from 'react';
import './GuestEntry.css';
import maleProfile from '../../assets/male.png';
import femaleProfile from '../../assets/female.png';
import defaultProfile from '../../assets/profile.png';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';

function ProfileCard({ draftGuest, onSelectGuest, isSelected }) {

    const getProfileImage = (gender) => {
        if (gender === 'Male') {
            return maleProfile;
        } else if (gender === 'Female') {
            return femaleProfile;
        } else {
            return defaultProfile;
        }
    };

    return (
        <div
            className={`profile-card ${isSelected ? 'selected' : ''}`}  // Add selected class
            onClick={onSelectGuest}  // Trigger selection
        >
            <div className="profile-image">
            </div>
            <div className="profile-details">
                <div style={{ width: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                        style={{ width: "90px", position: "relative", right: "50%", border: "1px solid var(--border-color)", borderRadius: "100%" }}
                        src={getProfileImage(draftGuest.gender)}
                        alt={`${draftGuest.name}'s profile`}
                    />
                </div>

                <div className="profile-info">
                    <p style={{ fontSize: "18px", fontWeight: "500" }}>{draftGuest.name || '--'}</p>
                    <p style={{ color: "#0a91fa", fontWeight: "400", display: "flex", alignItems: "center" }}>
                        <EmailIcon style={{ marginRight: "5px", color: "#6c7293", fontSize: "20px" }} />
                        {draftGuest.mail_id || '--'}
                    </p>
                    <p style={{ color: "#0a91fa", fontWeight: "400", display: "flex", alignItems: "center" }}>
                        <CallIcon style={{ marginRight: "5px", color: "#6c7293", fontSize: "20px" }} />
                        {draftGuest.phone_no || '--'}
                    </p>
                    <p><b>Purpose: </b>{draftGuest.purpose || '--'}</p>
                    <p
                        style={{
                            position: "absolute",
                            top: "5px",
                            right: "10px",
                            backgroundColor: draftGuest.visit_mode === 'Onsite' ? 'rgba(25, 193, 176, 0.223)' : draftGuest.visit_mode === 'Online' ? '#8a64cb4c' : 'transparent',
                            padding: "3px 10px",
                            borderRadius: "10px"
                        }}
                    >
                        {draftGuest.visit_mode}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
