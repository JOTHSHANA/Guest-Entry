import React from 'react';
import './GuestEntry.css';


function ProfessionalInfoForm({
    qualification, setQualification,
    companyName, setCompanyName,
    companyRole, setCompanyRole,
    visitMode, setVisitMode,
    purpose, setPurpose,
    fromDate, setFromDate,
    toDate, setToDate,
    availedDays, setAvailedDays,
    createGuest, setActiveTab
}) {
    return (
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
                <select value={visitMode} onChange={(e) => setVisitMode(e.target.value)}>
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

            <div className="input-group1">
                <div style={{flex:"1"}}>
                    <label>From Date:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div style={{flex:"1"}}>
                    <label>To Date:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {/* <div className="input-group">
               
            </div> */}

            <div className="input-group">
                <label>Availed Days:</label>
                <input
                    type="number"
                    value={availedDays}
                    onChange={(e) => setAvailedDays(e.target.value)}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setActiveTab(1)}>Previous</button>
                <button onClick={createGuest}>Submit Details</button>
            </div>
        </div>
    );
}

export default ProfessionalInfoForm;
