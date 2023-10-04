Name: GAO QIANXI
Class: DIT/FT/1B/06
Admin No.: 2241434

1. Open source code in Vscode
- open terminal
- run npm install
- run npm i nodemon -- force (install nodemon if don't have)
- run nodemon


2. Open MySQL WorkBench
- Create a schema called bed_dvd_db
- Open and run the bed_sakila.sql script
- Go administration > users and privileges > add account 
- Enter account details:
         Login Name: bed_dvd_root
         Password: pa$$woRD123
         Confirm Password: pa$$woRD123
- Go schema privileges > add entry > selected schema > bed_dvd_db


3. Open Postman (New > HTTP request)
- Endpoint 1: GET request
http://localhost:8081/actors/:actor_id (E.g. http://localhost:8081/actors/2)

- Endpoint 2: GET request (Put limit and offset in params if needed)
http://localhost:8081/actors (E.g. http://localhost:8081/actors/?limit=20&offset=4)

- Endpoint 3: POST request (Put object inside body > raw > change text to json)
http://localhost:8081/actors

example object: 
{
    "first_name": "KEN", 
    "last_name": "LEE"
}

- Endpoint 4: PUT request (Put object inside body > raw > change text to json)
http://localhost:8081/actors/:actor_id (E.g. http://localhost:8081/actors/1)

example object:
{
    "first_name": "KENNY"
}

- Endpoint 5: DELETE request
http://localhost:8081/actors/:actor_id (E.g. http://localhost:8081/actors/1)

- Endpoint 6: GET request
http://localhost:8081/film_categories/:category_id/films (E.g. http://localhost:8081/film_categories/9/films)

- Endpoint 7: GET request
http://localhost:8081/customer/:customer_id/payment (E.g. http://localhost:8081/customer/5/payment?start_date=2005-06-01&end_date=2005-06-30)

- Endpoint 8: POST request (Put object inside body > raw > change text to json)
http://localhost:8081/customers 

example object:
{
    "store_id": "1",
    "first_name":"MARTIN",
    "last_name": "SIM",
    "email":"martin_sim@gmail.com",
    "address": {
        "address_line1": "77 elm street",
        "address_line2": "",
        "district": "California",
        "city_id": "449",
        "postal_code": "17886",
        "phone": "6325-8596"
    }
}

- Additional Endpoint: POST request (Put object inside body > raw > change text to json)
http://localhost:8081/staff

example object:
{
    "store_id": "1",
    "first_name":"MARTIN",
    "last_name": "SIM",
    "email":"martin_sim@gmail.com",
    "username": "MARTIN",
    "password": 12345,
    "address": {
        "address_line1": "77 elm street",
        "address_line2": "",
        "district": "California",
        "city_id": "449",
        "postal_code": "17886",
        "phone": "6325-8596"
    }
}
