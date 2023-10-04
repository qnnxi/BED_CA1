// Name: GAO QIANXI
// Class: DIT/FT/1B/06
// Admin No.: 2241434

const db = require('./databaseConfig');

const actorDB = {
    // ENDPOINT 1: Return actor information of the given actor_id
    getActorById: (actor_id, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;';

                conn.query(sql, [actor_id], (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        if (result.length == 0) {
                            return callback(null, null); // actor_id does not exist
                        } else {
                            return callback(null, result); // actor_id exist
                        }
                    }
                });
            }
        })
    },


    // ENDPOINT 2: Return the list of actors ordered by first_name, limited to 20 records offset 0 by default
    getActorByDate: (limit, offset, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?;'

                conn.query(sql, [parseInt(limit), parseInt(offset)], (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        if (result.length == 0) {
                            return callback(null, null); // record cannot be found
                        } else {
                            return callback(null, result); // record found
                        }
                    }
                });
            }
        })
    },


    // ENDPOINT 3: Add a new actor to the database (note: actors can have the same first_name and last_name)
    addActors: (first_name, last_name, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name) VALUES (?, ?);';

                conn.query(sql, [first_name, last_name], (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        return callback(null, result.insertId); // result 
                    }
                });
            }
        })
    },


    // ENDPOINT 4: Update actor’s first name or last name or both
    updateActors: (first_name, last_name, actor_id, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                let s = '';
                if (first_name) {
                    s += `first_name = '${first_name}'`; // if true, first_name will be added to s
                };

                if (last_name) {
                    if (s) {
                        s += ', '; // if true, first_name and last_name will be added to s with a "," between it
                    };
                    s += `last_name = '${last_name}'`; // if true, last_name will be added to s
                };

                const sql = `UPDATE actor SET ${s} WHERE actor_id = ${actor_id};`;

                conn.query(sql, (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        if (result.affectedRows == 0) {
                            return callback(null, null); // actor_id does not exist
                        } else {
                            return callback(null, result); // actor_id exist
                        }
                    }
                });
            }
        })
    },


    // ENDPOINT 5: Remove actor from database
    deleteActors: (actor_id, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = 'DELETE FROM film_actor WHERE actor_id = ?;';

                conn.query(sql, [actor_id], (err, result) => {
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        const sql2 = 'DELETE FROM actor WHERE actor_id = ?;';

                        conn.query(sql2, [actor_id], (err, result) => {
                            conn.end(); // end connection to save memory space
                            if (err) {
                                return callback(err, null); //if query have error
                            } else {
                                if (result.affectedRows == 0) {
                                    return callback(null, null); // actor_id does not exist
                                } else {
                                    return callback(null, result); // actor_id exist
                                }
                            }
                        });
                    }
                });
            }
        })
    },


    // ENDPOINT 6: Return the film_id, title, rating, release_year and length of all films belonging to a category
    getFilm: (category_id, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = `
                SELECT FC.film_id, F.title, C.name AS category, F.rating, F.release_year, F.length AS duration
                FROM film AS F
                INNER JOIN film_category AS FC ON FC.film_id = F.film_id 
                INNER JOIN category AS C ON C.category_id = FC.category_id
                WHERE FC.category_id = ?;
                `;

                conn.query(sql, [category_id], (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); //if query have error
                    } else {
                        if (result.length == 0) {
                            return callback(null, null); // category_id does not exist
                        } else {
                            return callback(null, result); // category_id exist
                        }
                    }
                });
            }
        })
    },


    // ENDPOINT 7: Return the payment detail of a customer between the provided period
    getPayment: (start_date, end_date, customer_id, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            } else {
                const sql = `
                SELECT F.title, P.amount, P.payment_date
                FROM payment AS P
                INNER JOIN rental AS R INNER JOIN inventory AS I INNER JOIN film AS F
                ON P.rental_id = R.rental_id AND R.inventory_id = I.inventory_id AND I.film_id = F.film_id 
                WHERE P.payment_date BETWEEN ? AND ? AND P.customer_id = ?;           
                `;

                conn.query(sql, [start_date, end_date, customer_id], (err, result) => {
                    conn.end(); // end connection to save memory space
                    if (err) {
                        return callback(err, null); // if query have error
                    } else {
                        if (result.length == 0) {
                            return callback(null, null); // record cannot be found
                        } else {
                            return callback(null, result); // record found
                        }
                    }
                });
            }
        })
    },


    // ENDPOINT 8: Add a new customer to the database (note: customer’s email address is unique)
    addCustomer: (store_id, first_name, last_name, email, address, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            }

            let keys = []; // store all the keys
            let values = []; // store all the values

            // assign new name for address
            const newName = {
                address_line1: 'address',
                address_line2: 'address2'
            };

            for (let column of Object.keys(address)) { // loop through the address keys
                if (address[column]) { // make sure address values not undefined, null, empty
                    if (Object.keys(newName).includes(column)) { // check whether address key contain inside newName or not
                        keys.push(newName[column]); // contain
                    } else {
                        keys.push(column); // does not contain
                    };
                    values.push(`"${address[column]}"`); // push in the values
                }
            }

            const sql = `INSERT INTO address (${keys.join(', ')}) VALUES (${values.join(', ')});`;

            conn.query(sql, (err, result) => {
                if (err) {
                    return callback(err, null); // if query have error
                } else {
                    const sql2 = `INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?, ?);`

                    conn.query(sql2, [store_id, first_name, last_name, email, result.insertId], (err, result) => {
                        conn.end(); // end connection to save memory space
                        if (err) {
                            return callback(err, null); // if query have error
                        } else {
                            return callback(null, result.insertId); // result
                        }
                    });
                }
            });
        });
    },


    // ADDITIONAL ENDPOINT: Add a staff to the database
    addStaff: (store_id, first_name, last_name, email, username, password, address, callback) => {
        const conn = db.getConnection(); // get connection from database

        conn.connect((err) => {
            if (err) {
                return callback(err, null); // if connection have error
            }

            let keys = []; // store all the keys
            let values = []; // store all the values

            // assign new name for address
            const newName = {
                address_line1: 'address',
                address_line2: 'address2'
            };

            for (let column of Object.keys(address)) { // loop through the address keys
                if (address[column]) { // make sure address values not undefined, null, empty
                    if (Object.keys(newName).includes(column)) { // check whether address key contain inside newName or not
                        keys.push(newName[column]); // contain
                    } else {
                        keys.push(column); // does not contain
                    };
                    values.push(`"${address[column]}"`); // push in the values
                }
            }

            const sql = `INSERT INTO address (${keys.join(', ')}) VALUES (${values.join(', ')});`;

            conn.query(sql, (err, result) => {
                if (err) {
                    return callback(err, null); // if query have error
                } else {

                    const sql2 = `INSERT INTO staff (store_id, first_name, last_name, email, username, password, address_id) VALUES (?, ?, ?, ?, ?, ?, ?);`

                    conn.query(sql2, [store_id, first_name, last_name, email, username, password, result.insertId], (err, result) => {
                        conn.end(); // end connection to save memory space
                        if (err) {
                            return callback(err, null); // if query have error
                        } else {
                            return callback(null, result.insertId); // result
                        }
                    });
                }
            });
        });
    }
};

module.exports = actorDB;