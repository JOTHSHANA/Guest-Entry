import React, { useState, useEffect } from "react";
import './Dashboard.css';
import requestApi from "../../components/utils/axios";
import profile from '../../assets/profile.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import male from '../../assets/male.png';
import female from '../../assets/female.png';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import BIT from '../../assets/BIT.png'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ProfileCard from "../GuestEntry/ProfileCard";

function Dashboard() {
    return <Body />;
}

function Body() {
    const [completedGuests, setCompletedGuest] = useState([]);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [pdfContent, setPdfContent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [draftGuests, setDraftGuest] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [guestDraftProfile, setGuestDraftProfile] = useState();


    const fetchCompletedGuests = async () => {
        try {
            const response = await requestApi("GET", `/api/getCompletedGuests`, {});
            const { completedGuests } = response.data;
            setCompletedGuest(completedGuests);
        } catch (error) {
            console.error('Error fetching completed profiles:', error);
        }
    };

    useEffect(() => {
        fetchCompletedGuests();
    }, []);

    const handleShowModal = (guest) => {
        setSelectedGuest(guest);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowPreviewModal = (guest) => {
        generatePdfContent(guest);
        setShowPreviewModal(true);
    };

    const handleClosePreviewModal = () => {
        setShowPreviewModal(false);
    };


    const fetchDraftDetail = async (guestId) => {
        try {
            const response = await requestApi("GET", `/api/guest?guestId=${guestId}`, {});
            setGuestDraftProfile(response.data)
            console.log(guestDraftProfile)

        } catch (error) {
            console.error('Error fetching draft profiles');
        }
    }

    const handleCardClick = (guestId) => {
        setOpenDialog(true);
        fetchDraftDetail(guestId)
    };

    // Handler to close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
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

    const generatePdfContent = (guest) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(40, 44, 52);
        doc.text('Guest Details', 10, 10);
        doc.autoTable({
            body: [
                ['Name', guest.name],
                ['Email', guest.mail_id],
                ['Date of Birth', new Date(guest.dob).toLocaleDateString()],
                ['Phone Number', guest.phone_no],
                ['Gender', guest.gender],
                ['Address', guest.address],
                ['Qualification', guest.qualification],
                ['Company Name', guest.company_name],
                ['Company Role', guest.company_role],
                ['Visit Mode', guest.visit_mode],
                ['Purpose', guest.purpose],
                ['From Date', new Date(guest.from_date).toLocaleDateString()],
                ['To Date', new Date(guest.to_date).toLocaleDateString()],
                ['Availed Days', guest.availed_days],
            ],
            theme: 'grid',
            styles: {
                fontSize: 12,
                textColor: [67, 74, 84],
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontSize: 14,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
            },
            alternateRowStyles: {
                fillColor: [230, 240, 250],
            },
            margin: { top: 20 }, // Adjust top margin
        });

        setPdfContent(doc.output('datauristring'));
    };


    const downloadPdf = (guest) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('Guest Details', 10, 10);
        doc.autoTable({
            body: [
                ['Name', guest.name],
                ['Email', guest.mail_id],
                ['Date of Birth', new Date(guest.dob).toLocaleDateString()],
                ['Phone Number', guest.phone_no],
                ['Gender', guest.gender],
                ['Address', guest.address],
                ['Qualification', guest.qualification],
                ['Company Name', guest.company_name],
                ['Company Role', guest.company_role],
                ['Visit Mode', guest.visit_mode],
                ['Purpose', guest.purpose],
                ['From Date', new Date(guest.from_date).toLocaleDateString()],
                ['To Date', new Date(guest.to_date).toLocaleDateString()],
                ['Availed Days', guest.availed_days],
            ],
            theme: 'grid',
            styles: {
                fontSize: 12,
                textColor: [67, 74, 84],
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontSize: 14,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
            },
            alternateRowStyles: {
                fillColor: [230, 240, 250],
            },
            margin: { top: 20 }, // Adjust top margin
        });
        doc.save(`${guest.name}_details.pdf`);
    };

    const getProfileImage = (gender) => {
        if (gender === "Male") {
            return male;
        } else if (gender === "Female") {
            return female;
        } else {
            return profile;  // Default image
        }
    };

    const filteredGuests = completedGuests.filter((guest) =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 480 }}
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <p className="draft-topic">Draft Profiles</p>
            {draftGuests.map((draftGuest, index) => (
                <div onClick={() => handleCardClick(draftGuest.guestId)}>
                    <ProfileCard key={index} draftGuest={draftGuest} profileImage={profile} />
                </div>
            ))}
        </Box>
    );

    return (
        <div className="dashboard">
            <div className="search-div">
                <ManageSearchIcon className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                {/* <button style={{ marginLeft: "5px", marginTop: "0px", padding: "5px 10px" }}>view Drafts</button> */}
                <div>
                    {['right'].map((anchor) => (
                        <React.Fragment key={anchor}>
                            <Button onClick={toggleDrawer(anchor, true)}>View Drafts</Button>
                            <Drawer
                                anchor={anchor}
                                open={state[anchor]}
                                onClose={toggleDrawer(anchor, false)}
                            >
                                <div style={{ backgroundColor: "var(--background-1)" }}>{list(anchor)}</div>
                            </Drawer>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {filteredGuests.length > 0 ? (
                <div className="guest-list">
                    {filteredGuests.map((guest, index) => (
                        <div key={index} className="guest-card">
                            <img src={getProfileImage(guest.gender)} alt="Guest Profile" />
                            <h4>{guest.name}</h4>
                            <div className="contact-profile-info">
                                <p style={{ color: "#0a91fa", fontWeight: "400", display: "flex", alignItems: "center" }}>
                                    <EmailIcon style={{ marginRight: "5px", color: "#6c7293", fontSize: "20px" }} />{guest.mail_id}
                                </p>
                                <p style={{ fontWeight: "400", display: "flex", alignItems: "center" }}>
                                    <CallIcon style={{ marginRight: "5px", color: "#6c7293", fontSize: "20px" }} />
                                    {guest.phone_no}
                                </p>
                            </div>
                            <button style={{ width: "100%", boxSizing: "border-box" }} onClick={() => handleShowModal(guest)}>View More Details</button>

                        </div>
                    ))}
                </div>
            ) : (
                <p>No completed guests found.</p>
            )}

            {selectedGuest && (
                <Dialog
                    open={showModal}
                    onClose={handleCloseModal}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        className: 'custom-dialog', // Add the custom class
                    }}
                >
                    <div style={{
                        backgroundColor: "var(--background-1)", color: "var(--text)"
                    }}>
                        <DialogTitle><div className="popup-profile">
                            <img src={getProfileImage(selectedGuest.gender)} alt="Guest Profile" />
                            {selectedGuest.name}
                        </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            <DialogContentText>
                                <div className="modal-row">
                                    <b>Email:</b>
                                    <span>{selectedGuest.mail_id}</span>
                                </div>
                                <div className="modal-row">
                                    <b>DOB:</b>
                                    <span>{new Date(selectedGuest.dob).toLocaleDateString()}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Phone Number:</b>
                                    <span>{selectedGuest.phone_no}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Gender:</b>
                                    <span>{selectedGuest.gender}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Address:</b>
                                    <span>{selectedGuest.address}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Qualification:</b>
                                    <span>{selectedGuest.qualification}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Company Name:</b>
                                    <span>{selectedGuest.company_name}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Company Role:</b>
                                    <span>{selectedGuest.company_role}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Visit Mode:</b>
                                    <span>{selectedGuest.visit_mode}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Purpose:</b>
                                    <span>{selectedGuest.purpose}</span>
                                </div>
                                <div className="modal-row">
                                    <b>From Date:</b>
                                    <span>{new Date(selectedGuest.from_date).toLocaleDateString()}</span>
                                </div>
                                <div className="modal-row">
                                    <b>To Date:</b>
                                    <span>{new Date(selectedGuest.to_date).toLocaleDateString()}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Availed Days:</b>
                                    <span>{selectedGuest.availed_days}</span>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} color="primary">Close</Button>
                            <Button onClick={() => handleShowPreviewModal(selectedGuest)} color="primary">Preview PDF</Button>
                        </DialogActions>
                    </div>
                </Dialog>
            )}

            <Dialog
                open={showPreviewModal}
                onClose={handleClosePreviewModal}
                fullWidth
                maxWidth="sm"
            >
                <div style={{
                    backgroundColor: "var(--background-1)", color: "var(--text)"
                }}>
                    <DialogTitle>PDF Preview</DialogTitle>
                    <DialogContent dividers>
                        {pdfContent ? (
                            <iframe src={pdfContent} width="100%" height="450px" title="PDF Preview"></iframe>
                        ) : (
                            <p>Loading preview...</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePreviewModal} color="primary">Close</Button>
                        <Button onClick={() => downloadPdf(selectedGuest)} color="primary">Download PDF</Button>
                    </DialogActions>
                </div>
            </Dialog>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{guestDraftProfile ? guestDraftProfile.guest.name : "Profile Details"}</DialogTitle>
                <DialogContent dividers>
                    {guestDraftProfile ? (
                        <div>
                            <div className="modal-row">
                                    <b>Email:</b>
                                    <span>{guestDraftProfile.guest.mail_id || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>DOB:</b>
                                    <span>{new Date(guestDraftProfile.guest.dob).toLocaleDateString() || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Phone Number:</b>
                                    <span>{guestDraftProfile.guest.phone_no || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Gender:</b>
                                    <span>{guestDraftProfile.guest.gender || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Address:</b>
                                    <span>{guestDraftProfile.guest.address || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Qualification:</b>
                                    <span>{guestDraftProfile.guest.qualification || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Company Name:</b>
                                    <span>{guestDraftProfile.guest.company_name || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Company Role:</b>
                                    <span>{guestDraftProfile.guest.company_role || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Visit Mode:</b>
                                    <span>{guestDraftProfile.guest.visit_mode || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Purpose:</b>
                                    <span>{guestDraftProfile.guest.purpose || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>From Date:</b>
                                    <span>{new Date(guestDraftProfile.guest.from_date).toLocaleDateString() || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>To Date:</b>
                                    <span>{new Date(guestDraftProfile.guest.to_date).toLocaleDateString() || "--"}</span>
                                </div>
                                <div className="modal-row">
                                    <b>Availed Days:</b>
                                    <span>{guestDraftProfile.guest.availed_days || "--"}</span>
                                </div>
                        </div>
                    ) : (
                        <p>Loading profile details...</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Dashboard;
