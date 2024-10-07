import React from 'react';
import './GuestEntry.css';


function PersonalInfoForm({
    name, setName,
    email, setEmail,
    dob, setDob,
    phoneNumber, setPhoneNumber,
    gender, setGender,
    address, setAddress,
    setActiveTab
}) {
    return (
        <div className="form">
            <div className="input-group">
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Date of Birth:</label>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Gender:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="input-group">
                <label>Address:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setActiveTab(2)}>Next</button>
            </div>
        </div>
    );
}

export default PersonalInfoForm;
