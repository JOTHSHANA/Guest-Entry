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

    // Once all promises are resolved, insert into guests table
    Promise.all([insertPersonal, insertProfessional, insertEvent])
        .then(([personalId, professionalId, eventId]) => {
            db.query('INSERT INTO guests (personal, professional, event) VALUES (?, ?, ?)',
                [personalId, professionalId, eventId], (err, result) => {
                    if (err) {
                        console.error('Error linking guest details:', err);
                        return res.status(500).json({ error: 'Error linking guest details' });
                    }

                    res.json({
                        success: true,
                        guestId: result.insertId,
                        personalId,
                        professionalId,
                        eventId
                    });
                });
        })
        .catch(error => {
            console.error('Error inserting guest details:', error);
            res.status(500).json({ error: 'An error occurred while inserting guest details' });
        });
};




exports.updateGuest = (req, res) => {
    const {
        guestId, // Assume guestId is passed in the body
        name, mail_id, dob, phone_no, gender, address,
        qualification, company_name, company_role,
        visit_mode, purpose, from_date, to_date, availed_days
    } = req.body;

    // First, retrieve the personal, professional, and event IDs associated with the guest
    db.query('SELECT personal, professional, event FROM guests WHERE id = ?', [guestId], (err, result) => {
        if (err) {
            console.error('Error retrieving guest details:', err);
            return res.status(500).json({ error: 'Error retrieving guest details' });
        }

        const { personal, professional, event } = result[0];

        // Update personal_details
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

        // Update professional_details
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

        // Update event details
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

        // Once all updates are completed, return success response
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





