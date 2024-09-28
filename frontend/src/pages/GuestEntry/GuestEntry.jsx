import React, { useEffect, useState } from "react";
import './GuestEntry.css';
import requestApi from "../../components/utils/axios";
import profile from '../../assets/profile.png'

function GuestEntry() {
    return <Body />
}

function Body() {
    const [activeTab, setActiveTab] = useState(1); // Set initial active tab to 1
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');


    const [qualification, setQualification] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyRole, setCompanyRole] = useState('');
    const [visitMode, setVisitMode] = useState('');
    const [purpose, setPurpose] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [availedDays, setAvailedDays] = useState('');

    const [draftGuests, setDraftGuest] = useState([]);


    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex); // Update active tab when clicked
    };

    const handleNextClick = () => {
        setActiveTab(2); // Move to tab 2 when "Next" is clicked
    };

    const handlePreviousClick = () => {
        setActiveTab(1);
    }

    const createGuest = async (req, res) => {
        try {
            const response = await requestApi("POST", `/api/createGuest`, {
                name: name,
                mail_id: email,
                phone_no: phoneNumber,
                address: address,
                qualification: qualification,
                company_name: companyName,
                company_role: companyRole,
                visit_mode: visitMode,
                purpose: purpose,
                from_date: fromDate,
                to_date: toDate,
                availed_days: availedDays
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const fetchDraftGuests = async (req, res) => {
        try {
            const response = await requestApi("GET", `/api/getDraftGuests`, {});
            console.log(response.data)
            const { draftGuests } = response.data
            setDraftGuest(draftGuests)
        }
        catch {
            console.error('Error fetching draft profiles');
        }
    }

    useEffect(() => {
        fetchDraftGuests();
    }, [])


    return (
        <div className="guest-listing-page">
            <div className="info-container">
                {draftGuests.map((draftGuest, index) => (
                    <div className="profile-card" key={index}>
                        <div className="profile-image">
                        </div>
                        <div className="profile-details">
                            <div style={{ width: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img style={{ width: "90px", position: "relative", right: "50%", border: "1px solid var(--border-color)", borderRadius: "100%" }} src={profile} alt="" />
                            </div>

                            <div className="profile-info">
                                <p style={{ fontSize: "18px", fontWeight: "500" }}>{draftGuest.name}</p>
                                <p style={{ color: "#0a91fa", fontWeight: "600" }}>{draftGuest.mail_id}</p>
                                <p>{draftGuest.phone_no || 'N/A'}</p>
                                <p><b>Purpose: </b>{draftGuest.purpose}</p>
                                <p style={{ position: "absolute", top: "5px", right: "10px", backgroundColor: "rgba(25, 193, 176, 0.223)", padding: "3px 10px", borderRadius: "10px" }}>{draftGuest.visit_mode}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            <div className="form-container">

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
                    <div className="form-content">
                        {activeTab === 1 && (
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
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
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
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                                    <button onClick={handleNextClick}>Next</button>

                                </div>
                            </div>
                        )}
                        {activeTab === 2 && (
                            <div>
                                <div className="input-group">
                                    <label>Qualification:</label>
                                    <input
                                        type="text"
                                        value={qualification}
                                        onChange={(e) => setQualification(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Company Name:</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Company Role:</label>
                                    <input
                                        type="text"
                                        value={companyRole}
                                        onChange={(e) => setCompanyRole(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Visit Mode:</label>
                                    <select
                                        value={visitMode}
                                        onChange={(e) => setVisitMode(e.target.value)}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="Online">Online</option>
                                        <option value="Onsite">Onsite</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Purpose:</label>
                                    <input
                                        type="text"
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>From Date:</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>To Date:</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Availed Days:</label>
                                    <input
                                        type="number"
                                        value={availedDays}
                                        onChange={(e) => setAvailedDays(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                                    <button onClick={handlePreviousClick}>Previous</button>
                                    <button onClick={createGuest}>Submit Details</button>

                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default GuestEntry;
