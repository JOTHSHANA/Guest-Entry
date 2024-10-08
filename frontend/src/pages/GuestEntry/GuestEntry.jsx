import React, { useEffect, useState } from "react";
import './GuestEntry.css';
import requestApi from "../../components/utils/axios";
import ProfileCard from "./ProfileCard";
import PersonalInfoForm from "./PersonalInfoForm";
import ProfessionalInfoForm from "./ProfessionalInfoForm";
import Tabs from "./Tabs";
import profile from '../../assets/profile.png';

function GuestEntry() {
    const [activeTab, setActiveTab] = useState(1);
    const [selectedGuestId, setSelectedGuestId] = useState(null); // New state for selected guest
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
    const [draftGuests, setDraftGuests] = useState([]);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };



    const createGuest = async () => {
        if (name === '') return;

        const requestBody = {
            guestId: selectedGuestId, // Send guestId if editing
            name,
            mail_id: email,
            dob,
            phone_no: phoneNumber,
            gender,
            address,
            qualification,
            company_name: companyName,
            company_role: companyRole,
            visit_mode: visitMode,
            purpose,
            from_date: fromDate,
            to_date: toDate,
            availed_days: availedDays
        };

        // Determine whether to perform POST or PUT
        const method = selectedGuestId ? "PUT" : "POST";
        const url = selectedGuestId ? "/api/updateGuest" : "/api/createGuest";

        console.log(`Executing ${method} request to ${url} with body:`, requestBody);

        try {
            const response = await requestApi(method, url, requestBody);
            console.log(`${method} successful:`, response.data);
        } catch (error) {
            console.error(`Error submitting form:`, error);
        }
    };


    const fetchDraftGuests = async () => {
        try {
            const response = await requestApi("GET", "/api/getDraftGuests", {});
            setDraftGuests(response.data.draftGuests);
        } catch (error) {
            console.error('Error fetching draft profiles');
        }
    };

    const fetchDraftDetail = async (guestId) => {
        console.log("called")
        try {
            const response = await requestApi("GET", `/api/guest?guestId=${guestId}`, {});
            const guestData = response.data;
            setName(guestData.guest.name || ''); // Set to empty if null
            setEmail(guestData.guest.mail_id || ''); // Set to empty if null
            setDob(guestData.guest.dob || ''); // Set to empty if null
            setPhoneNumber(guestData.guest.phone_no || ''); // Set to empty if null
            setGender(guestData.guest.gender || ''); // Set to empty if null
            setAddress(guestData.guest.address || ''); // Set to empty if null
            setQualification(guestData.guest.qualification || ''); // Set to empty if null
            setCompanyName(guestData.guest.company_name || ''); // Set to empty if null
            setCompanyRole(guestData.guest.company_role || ''); // Set to empty if null
            setVisitMode(guestData.guest.visit_mode || ''); // Set to empty if null
            setPurpose(guestData.guest.purpose || ''); // Set to empty if null
            setFromDate(guestData.guest.from_date || ''); // Set to empty if null
            setToDate(guestData.guest.to_date || ''); // Set to empty if null
            setAvailedDays(guestData.guest.availed_days || null); // Set to empty if null
            setSelectedGuestId(guestData.guest.guestId || null); // Set selected guest id
        } catch (error) {
            console.error('Error fetching draft profile details', error);
        }
    };

    useEffect(() => {
        fetchDraftGuests();
    }, []);

    return (
        <div className="guest-listing-page">
            <div className="info-container">
                <p className="draft-topic">Draft Profiles</p>
                <hr />
                {draftGuests.map((draftGuest, index) => (
                    <ProfileCard
                        key={index}
                        draftGuest={draftGuest}
                        profileImage={profile}
                        onSelectGuest={() => fetchDraftDetail(draftGuest.guestId)} // Trigger fetch on card click
                        isSelected={draftGuest.guestId === selectedGuestId} // Pass selected state
                    />
                ))}
            </div>
            <div className="form-container">
                <Tabs activeTab={activeTab} handleTabClick={handleTabClick} />
                <div className="form-content">
                    {activeTab === 1 ? (
                        <PersonalInfoForm
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            dob={dob}
                            setDob={setDob}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            gender={gender}
                            setGender={setGender}
                            address={address}
                            setAddress={setAddress}
                            setActiveTab={setActiveTab}
                        />
                    ) : (
                        <ProfessionalInfoForm
                            qualification={qualification}
                            setQualification={setQualification}
                            companyName={companyName}
                            setCompanyName={setCompanyName}
                            companyRole={companyRole}
                            setCompanyRole={setCompanyRole}
                            visitMode={visitMode}
                            setVisitMode={setVisitMode}
                            purpose={purpose}
                            setPurpose={setPurpose}
                            fromDate={fromDate}
                            setFromDate={setFromDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            availedDays={availedDays}
                            setAvailedDays={setAvailedDays}
                            createGuest={createGuest}
                            setActiveTab={setActiveTab}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default GuestEntry;
