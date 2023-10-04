// Name: GAO QIANXI
// Class: DIT/FT/1B/06
// Admin No.: 2241434

const express = require('express');
const app = express();
const actor = require('../model/actor');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); // attach body-parser middleware
app.use(bodyParser.json()); // parse json data


// ENDPOINT 1: Return actor information of the given actor_id
app.get('/actors/:actor_id', (req, res) => {
    const actor_id = req.params.actor_id; // get actor_id from params

    actor.getActorById(actor_id, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            if (result) {
                res.status(200).json(result[0]); // actor_id exist
            } else {
                res.status(204).json(); // // actor_id does not exist
            }
        }
    });
});


// ENDPOINT 2: Return the list of actors ordered by first_name, limited to 20 records offset 0 by default
app.get('/actors', (req, res) => {
    let { limit, offset } = req.query; // get limit and offset from query

    // defualt limit and offset 
    if (limit == undefined || offset == undefined) {
        limit = 20;
        offset = 0;
    };

    actor.getActorByDate(limit, offset, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); //error
        } else {
            if (result) {
                res.status(200).json(result); // record found
            } else {
                res.status(200).json([]); // record cannot be found
            }
        }
    });
});


// ENDPOINT 3: Add a new actor to the database (note: actors can have the same first_name and last_name)
app.post('/actors', (req, res) => {
    const { first_name, last_name } = req.body; // get first_name and last_name from body

    try {
        if (!first_name.trim() || !last_name.trim()) {
            throw new Error;
        }
    } catch {
        res.status(400).json({ error_msg: "missing data" });
    };

    actor.addActors(first_name, last_name, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            res.status(201).json({ actor_id: result }); // result
        }
    });

});


// ENDPOINT 4: Update actor’s first name or last name or both
app.put('/actors/:actor_id', (req, res) => {
    const actor_id = req.params.actor_id; // get actor_id from params
    let { first_name, last_name } = req.body; // get first_name and last_name from body

    // false: undefined, null, empty
    // true: values inside (not empty)
    if (first_name) {
        first_name = first_name.trim(); // if true, trim first_name
    }

    if (last_name) {
        last_name = last_name.trim(); // if true, trim last_name
    }

    if (!first_name && !last_name) {
        res.status(400).json({ error_msg: 'missing data' }); // if missing first_name or last_name or both
    } else {
        actor.updateActors(first_name, last_name, actor_id, (err, result) => {
            if (err) {
                res.status(500).json({ error_msg: 'Internal server error' }); // error
            } else {
                if (result) {
                    res.status(200).json({ success_msg: 'record updated' }); // actor_id exist
                } else {
                    res.status(204).json(); // actor_id does not exist
                }
            }
        });
    }
});


// ENDPOINT 5: Remove actor from database
app.delete('/actors/:actor_id', (req, res) => {
    const actor_id = req.params.actor_id; // get actor_id from params

    actor.deleteActors(actor_id, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            if (result) {
                res.status(200).json({ success_msg: 'actor deleted' }); // actor_id exist
            } else {
                res.status(204).json(); // actor_id does not exist
            }
        }
    });
});


// ENDPOINT 6: Return the film_id, title, rating, release_year and length of all films belonging to a category
app.get('/film_categories/:category_id/films', (req, res) => {
    const category_id = req.params.category_id; // get category_id from params

    actor.getFilm(category_id, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            if (result) {
                res.status(200).json(result); // category_id exist
            } else {
                res.status(200).json([]); // category_id does not exist
            }
        }
    });
});


// ENDPOINT 7: Return the payment detail of a customer between the provided period
app.get('/customer/:customer_id/payment', (req, res) => {
    const { start_date, end_date } = req.query; // get start_date and end_date from query
    const customer_id = req.params.customer_id; // get customer_id from params

    actor.getPayment(start_date, end_date, customer_id, (err, result) => {
        if (err) {
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            if (result) {
                // calculate the total amount
                let sum = 0;
                for (let i = 0; i < result.length; i++) {
                    sum += result[i].amount;
                };
                res.status(200).json({ rental: result, total: sum.toFixed(2) }); // record found
            } else {
                res.status(200).json({ rental: [], total: 0 }); // record cannot be found
            }
        }
    });
});


// ENDPOINT 8: Add a new customer to the database (note: customer’s email address is unique)
app.post('/customers', (req, res) => {
    const { store_id, first_name, last_name, email, address } = req.body; // get store_id, first_name, last_name, email and address from body

    actor.addCustomer(store_id, first_name, last_name, email, address, (err, result) => {
        if (err) {
            if (err.code == 'ER_NO_DEFAULT_FOR_FIELD' || err.code == 'ER_BAD_NULL_ERROR') {
                return res.status(400).json({ error_msg: 'missing data' }); // missing data 
            }

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error_msg: 'email already exist' }); // duplicate email
            }
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            res.status(201).json({ customer_id: result }); // result
        }
    });
});


// ADDITIONAL ENDPOINT: Add a staff to the database
app.post('/staff', (req, res) => {
    const { store_id, first_name, last_name, email, username, password, address } = req.body; // get store_id, first_name, last_name, email, username, password and address from body

    actor.addStaff(store_id, first_name, last_name, email, username, password, address, (err, result) => {
        if (err) {
            if (err.code == 'ER_NO_DEFAULT_FOR_FIELD' || err.code == 'ER_BAD_NULL_ERROR') {
                return res.status(400).json({ error_msg: 'missing data' }); // missing data
            }
            res.status(500).json({ error_msg: 'Internal server error' }); // error
        } else {
            res.status(201).json({ staff_id: result }); // result
        }
    });
});


module.exports = app;
