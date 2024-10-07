import React from 'react';
import './GuestEntry.css';
import maleProfile from '../../assets/male.png';  // Import male profile image
import femaleProfile from '../../assets/female.png';  // Import female profile image
import defaultProfile from '../../assets/profile.png';  // Import default profile image

function ProfileCard({ draftGuest }) {

    const getProfileImage = (gender) => {
        // const normalizedGender = gender ? gender.toLowerCase() : null;
        console.log(gender)
        if (gender === 'Male') {
            return maleProfile;
        } else if (gender === 'Female') {
            return femaleProfile;
        } else {
            return defaultProfile;
        }
    };



    return (
        <div className="profile-card">
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
                    <p style={{ fontSize: "18px", fontWeight: "500" }}>{draftGuest.name}</p>
                    <p style={{ color: "#0a91fa", fontWeight: "600" }}>{draftGuest.mail_id}</p>
                    <p>{draftGuest.phone_no || 'N/A'}</p>
                    <p><b>Purpose: </b>{draftGuest.purpose}</p>
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
