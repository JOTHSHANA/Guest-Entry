const db = require('../config/db');

exports.createGuest = (req, res) => {
    const {
        name, mail_id, phone_no, address,
        visit_mode, qualification, company_name, company_role, purpose,
        availed_days, from_date, to_date
    } = req.body;

    const insertPersonal = new Promise((resolve, reject) => {
        db.query('INSERT INTO personal_details (name, mail_id, phone_no, address) VALUES (?, ?, ?, ?)',
            [name || null, mail_id || null, phone_no || null, address || null], (err, result) => {
                if (err) {
                    console.error('Error inserting personal details:', err);
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted personal_details ID
            });
    });

    // Insert into professional_details
    const insertProfessional = new Promise((resolve, reject) => {
        db.query('INSERT INTO professional_details (visit_mode, qualification, company_name, company_role, purpose, availed_days, from_date, to_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [visit_mode || null, qualification || null, company_name || null, company_role || null, purpose || null, availed_days || null, from_date || null, to_date || null],
            (err, result) => {
                if (err) {
                    console.error('Error inserting professional details:', err);
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted professional_details ID
            });
    });

    // Once both personal and professional records are inserted, link them in the guests table
    Promise.all([insertPersonal, insertProfessional])
        .then(([personalId, professionalId]) => {
            // Insert into guests table with temporary status
            db.query('INSERT INTO guests (personal, professional, status) VALUES (?, ?, "draft")',
                [personalId, professionalId], (err, result) => {
                    if (err) {
                        console.error('Error linking guest details:', err);
                        return res.status(500).json({ error: 'Error linking guest details' });
                    }

                    const guestId = result.insertId;

                    // Now check if any null fields exist in either personal or professional details
                    checkGuestStatus(personalId, professionalId, (status) => {
                        // Update the status of the guest based on the check
                        db.query('UPDATE guests SET status = ? WHERE id = ?', [status, guestId], (err) => {
                            if (err) {
                                console.error('Error updating guest status:', err);
                                return res.status(500).json({ error: 'Error updating guest status' });
                            }

                            // Respond with success and the guest details
                            res.json({
                                success: true,
                                guestId: guestId,
                                personalId: personalId,
                                professionalId: professionalId,
                                status: status  // Return the determined status (draft or final)
                            });
                        });
                    });
                });
        })
        .catch((error) => {
            console.error('Error inserting personal or professional details:', error);
            res.status(500).json({ error: 'An error occurred while inserting guest details' });
        });
};

// Function to check the status (draft or final) based on null values
const checkGuestStatus = (personalId, professionalId, callback) => {
    const personalQuery = 'SELECT * FROM personal_details WHERE id = ?';
    const professionalQuery = 'SELECT * FROM professional_details WHERE id = ?';

    db.query(personalQuery, [personalId], (err, personalResult) => {
        if (err) throw err;

        db.query(professionalQuery, [professionalId], (err, professionalResult) => {
            if (err) throw err;

            const personal = personalResult[0];
            const professional = professionalResult[0];

            // Check if any required fields are NULL in either personal or professional details
            const isDraft = !personal.name || !personal.mail_id || !personal.phone_no || !personal.address ||
                !professional.visit_mode || !professional.qualification || !professional.company_name ||
                !professional.company_role || !professional.purpose || !professional.from_date || !professional.to_date;

            // If any of the fields are NULL, mark it as 'draft', otherwise 'final'
            const status = isDraft ? 'draft' : 'final';
            callback(status); // Call the callback function with the status
        });
    });
};









// Store personal and professional details in the backend
exports.updateGuest = (req, res) => {
    const { 
        guestId, // Assume guestId is passed in the body
        name, mail_id, phone_no, address, 
        visit_mode, qualification, company_name, company_role, purpose, 
        availed_days, from_date, to_date 
    } = req.body;

    // First, retrieve the personal and professional IDs associated with the guest
    db.query('SELECT personal, professional FROM guests WHERE id = ?', [guestId], (err, result) => {
        if (err) {
            console.error('Error retrieving guest details:', err);
            return res.status(500).json({ error: 'Error retrieving guest details' });
        }

        const { personal: personalId, professional: professionalId } = result[0];

        // Update personal_details
        const updatePersonal = new Promise((resolve, reject) => {
            db.query('UPDATE personal_details SET name = ?, mail_id = ?, phone_no = ?, address = ? WHERE id = ?', 
            [name || null, mail_id || null, phone_no || null, address || null, personalId], (err, result) => {
                if (err) {
                    console.error('Error updating personal details:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });

        // Update professional_details
        const updateProfessional = new Promise((resolve, reject) => {
            db.query('UPDATE professional_details SET visit_mode = ?, qualification = ?, company_name = ?, company_role = ?, purpose = ?, availed_days = ?, from_date = ?, to_date = ? WHERE id = ?', 
            [visit_mode || null, qualification || null, company_name || null, company_role || null, purpose || null, availed_days || null, from_date || null, to_date || null, professionalId], 
            (err, result) => {
                if (err) {
                    console.error('Error updating professional details:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });

        // Once both personal and professional details are updated, check if the status should be updated
        Promise.all([updatePersonal, updateProfessional])
            .then(() => {
                // Now check if any null fields exist in either personal or professional details
                checkGuestStatus(personalId, professionalId, (status) => {
                    // Update the status of the guest based on the check
                    db.query('UPDATE guests SET status = ? WHERE id = ?', [status, guestId], (err) => {
                        if (err) {
                            console.error('Error updating guest status:', err);
                            return res.status(500).json({ error: 'Error updating guest status' });
                        }

                        // Respond with success and the updated guest details
                        res.json({
                            success: true,
                            guestId: guestId,
                            personalId: personalId,
                            professionalId: professionalId,
                            status: status  // Return the determined status (draft or final)
                        });
                    });
                });
            })
            .catch((error) => {
                console.error('Error updating guest details:', error);
                res.status(500).json({ error: 'An error occurred while updating guest details' });
            });
    });
};






exports.getCompletedGuests = (req, res) => {
    // Query to get all guests whose status is 'final'
    const query = `
        SELECT 
            g.id AS guestId,
            pd.name,
            pd.mail_id,
            pd.phone_no,
            pd.address,
            prd.visit_mode,
            prd.qualification,
            prd.company_name,
            prd.company_role,
            prd.purpose,
            prd.availed_days,
            prd.from_date,
            prd.to_date
        FROM 
            guests g
        JOIN 
            personal_details pd ON g.personal = pd.id
        JOIN 
            professional_details prd ON g.professional = prd.id
        WHERE 
            g.status = 'final'
    `;

    // Execute the query to fetch all guests with 'final' status
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching completed guest details:', err);
            return res.status(500).json({ error: 'Error fetching completed guest details' });
        }

        // Return the fetched completed guest details
        res.json({
            success: true,
            completedGuests: results
        });
    });
};



// Get draft guest details
exports.getDraftGuests = (req, res) => {
    // Query to get all guests whose status is 'draft'
    const query = `
        SELECT 
            g.id AS guestId,
            pd.name,
            pd.mail_id,
            pd.phone_no,
            pd.address,
            prd.visit_mode,
            prd.qualification,
            prd.company_name,
            prd.company_role,
            prd.purpose,
            prd.availed_days,
            prd.from_date,
            prd.to_date
        FROM 
            guests g
        JOIN 
            personal_details pd ON g.personal = pd.id
        JOIN 
            professional_details prd ON g.professional = prd.id
        WHERE 
            g.status = 'draft'
    `;

    // Execute the query to fetch all guests with 'draft' status
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching draft guest details:', err);
            return res.status(500).json({ error: 'Error fetching draft guest details' });
        }

        // Return the fetched draft guest details
        res.json({
            success: true,
            draftGuests: results
        });
    });
};
