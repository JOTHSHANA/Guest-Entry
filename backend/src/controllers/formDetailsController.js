const db = require('../config/db');

exports.createGuest = (req, res) => {
    const {
        name, mail_id, dob, phone_no, gender, address,
        qualification, company_name, company_role,
        visit_mode, purpose, from_date, to_date, availed_days
    } = req.body;

    // Insert into personal_details
    const insertPersonal = new Promise((resolve, reject) => {
        db.query('INSERT INTO personal_details (name, mail_id, dob, phone_no, gender, address) VALUES (?, ?, ?, ?, ?, ?)',
            [name || null, mail_id || null, dob || null, phone_no || null, gender || null, address || null], (err, result) => {
                if (err) {
                    console.error('Error inserting personal details:', err);
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted personal_details ID
            });
    });

    // Insert into professional_details
    const insertProfessional = new Promise((resolve, reject) => {
        db.query('INSERT INTO professional_details (qualification, company_name, company_role) VALUES (?, ?, ?)',
            [qualification || null, company_name || null, company_role || null], (err, result) => {
                if (err) {
                    console.error('Error inserting professional details:', err);
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted professional_details ID
            });
    });

    // Insert into events table
    const insertEvent = new Promise((resolve, reject) => {
        db.query('INSERT INTO events (visit_mode, purpose, from_date, to_date, availed_days) VALUES (?, ?, ?, ?, ?)',
            [visit_mode || null, purpose || null, from_date || null, to_date || null, availed_days || null], (err, result) => {
                if (err) {
                    console.error('Error inserting event details:', err);
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted event ID
            });
    });

    // Once all promises are resolved, insert into guests table with default status 'draft'
    Promise.all([insertPersonal, insertProfessional, insertEvent])
        .then(([personalId, professionalId, eventId]) => {
            db.query('INSERT INTO guests (personal, professional, event, status) VALUES (?, ?, ?, ?)',
                [personalId, professionalId, eventId, 'draft'], (err, result) => {
                    if (err) {
                        console.error('Error linking guest details:', err);
                        return res.status(500).json({ error: 'Error linking guest details' });
                    }

                    const guestId = result.insertId;

                    // Check if all fields are non-null
                    if (name && mail_id && dob && phone_no && gender && address &&
                        qualification && company_name && company_role &&
                        visit_mode && purpose && from_date && to_date && availed_days) {

                        // Update the status to 'final' if all values are present
                        db.query('UPDATE guests SET status = ? WHERE id = ?', ['final', guestId], (err) => {
                            if (err) {
                                console.error('Error updating guest status:', err);
                                return res.status(500).json({ error: 'Error updating guest status' });
                            }

                            return res.json({
                                success: true,
                                guestId,
                                personalId,
                                professionalId,
                                eventId,
                                status: 'final'
                            });
                        });
                    } else {
                        res.json({
                            success: true,
                            guestId,
                            personalId,
                            professionalId,
                            eventId,
                            status: 'draft'
                        });
                    }
                });
        })
        .catch(error => {
            console.error('Error inserting guest details:', error);
            res.status(500).json({ error: 'An error occurred while inserting guest details' });
        });
};



exports.updateGuest = (req, res) => {
    const {
        guestId, 
        name, mail_id, dob, phone_no, gender, address,
        qualification, company_name, company_role,
        visit_mode, purpose, from_date, to_date, availed_days
    } = req.body;

    db.query('SELECT personal, professional, event FROM guests WHERE id = ?', [guestId], (err, result) => {
        if (err) {
            console.error('Error retrieving guest details:', err);
            return res.status(500).json({ error: 'Error retrieving guest details' });
        }

        const { personal, professional, event } = result[0];

        const updatePersonal = new Promise((resolve, reject) => {
            db.query('UPDATE personal_details SET name = ?, mail_id = ?, dob = ?, phone_no = ?, gender =?, address = ? WHERE id = ?',
                [name || null, mail_id || null, dob || null, phone_no || null, gender || null, address || null, personal], (err, result) => {
                    if (err) {
                        console.error('Error updating personal details:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
        });

        const updateProfessional = new Promise((resolve, reject) => {
            db.query('UPDATE professional_details SET qualification = ?, company_name = ?, company_role = ? WHERE id = ?',
                [qualification || null, company_name || null, company_role || null, professional], (err, result) => {
                    if (err) {
                        console.error('Error updating professional details:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
        });

        const updateEvent = new Promise((resolve, reject) => {
            db.query('UPDATE events SET visit_mode = ?, purpose = ?, from_date = ?, to_date = ?, availed_days = ? WHERE id = ?',
                [visit_mode || null, purpose || null, from_date || null, to_date || null, availed_days || null, event], (err, result) => {
                    if (err) {
                        console.error('Error updating event details:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
        });

        Promise.all([updatePersonal, updateProfessional, updateEvent])
            .then(() => {
                res.json({
                    success: true,
                    guestId,
                    personalId: personal,
                    professionalId: professional,
                    eventId: event
                });
            })
            .catch(error => {
                console.error('Error updating guest details:', error);
                res.status(500).json({ error: 'An error occurred while updating guest details' });
            });
    });
};





exports.getCompletedGuests = (req, res) => {
    const query = `
        SELECT 
            g.id AS guestId,
            pd.name,
            pd.mail_id,
            pd.dob,
            pd.phone_no,
            pd.gender,
            pd.address,
            prd.qualification,
            prd.company_name,
            prd.company_role,
            ev.visit_mode,
            ev.purpose,
            ev.from_date,
            ev.to_date,
            ev.availed_days
        FROM 
            guests g
        JOIN 
            personal_details pd ON g.personal = pd.id
        JOIN 
            professional_details prd ON g.professional = prd.id
        JOIN 
            events ev ON g.event = ev.id
        WHERE 
            g.status = 'final'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching completed guest details:', err);
            return res.status(500).json({ error: 'Error fetching completed guest details' });
        }

        res.json({
            success: true,
            completedGuests: results
        });
    });
};


exports.getGuest = (req, res) => {
    const { guestId } = req.query; // Retrieve guestId from the query string

    // Check if guestId is provided
    if (!guestId) {
        return res.status(400).json({ error: 'guestId is required' });
    }

    // Define the query to get guest details
    const query = `
        SELECT 
            g.id AS guestId,
            pd.name,
            pd.mail_id,
            pd.dob,
            pd.phone_no,
            pd.gender,
            pd.address,
            prd.qualification,
            prd.company_name,
            prd.company_role,
            ev.visit_mode,
            ev.purpose,
            ev.from_date,
            ev.to_date,
            ev.availed_days
        FROM 
            guests g
        JOIN 
            personal_details pd ON g.personal = pd.id
        JOIN 
            professional_details prd ON g.professional = prd.id
        JOIN 
            events ev ON g.event = ev.id
        WHERE 
            g.id = ? AND g.status = 'draft'
    `;

    // Execute the query
    db.query(query, [guestId], (err, results) => {
        if (err) {
            console.error('Error fetching guest details:', err);
            return res.status(500).json({ error: 'Error fetching guest details' });
        }

        // Check if any results were found
        if (results.length === 0) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        // Return the guest details
        res.json({
            success: true,
            guest: results[0] // Send back the first (and should be only) result
        });
    });
};



exports.getDraftGuests = (req, res) => {
    const query = `
        SELECT 
            g.id AS guestId,
            pd.name,
            pd.mail_id,
            pd.dob,
            pd.phone_no,
            pd.gender,
            pd.address,
            prd.qualification,
            prd.company_name,
            prd.company_role,
            ev.visit_mode,
            ev.purpose,
            ev.from_date,
            ev.to_date,
            ev.availed_days
        FROM 
            guests g
        JOIN 
            personal_details pd ON g.personal = pd.id
        JOIN 
            professional_details prd ON g.professional = prd.id
        JOIN 
            events ev ON g.event = ev.id
        WHERE 
            g.status = 'draft'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching draft guest details:', err);
            return res.status(500).json({ error: 'Error fetching draft guest details' });
        }

        res.json({
            success: true,
            draftGuests: results
        });
    });
};





