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
        setActiveTab(tabIndex);
    };

    const createGuest = async () => {
        if(name === ''){

        }
        try {
            const response = await requestApi("POST", `/api/createGuest`, {
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
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const fetchDraftGuests = async () => {
        try {
            const response = await requestApi("GET", `/api/getDraftGuests`, {});
            const { draftGuests } = response.data;
            setDraftGuest(draftGuests);
        } catch (error) {
            console.error('Error fetching draft profiles');
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
                    <ProfileCard key={index} draftGuest={draftGuest} profileImage={profile} />
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
