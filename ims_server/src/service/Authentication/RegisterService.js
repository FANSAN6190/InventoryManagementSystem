import pool from "../../config/DBConfig.js";

export async function RegisterService(register_request) {
    const { fullName, dob, email, phoneNo, password} = register_request.body;

    const hashedPassword = passwordHashing(password);
    const userCode = generateUserCode(fullName, phoneNo);

    // Connect to the database
    let client;
    try {
        client = pool.connect();
    } catch (err) {
        console.error("Database connection failed :: " + err);
    }

    try {
        // Insert the user data into the database
        const insertUserQuery = `INSERT INTO ims_schema.users(user_code, full_name, email, phone_no, dob, hash_pwd)
        VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [userCode, fullName, email, phoneNo, dob, hashedPassword];
        try {
            client.query(insertUserQuery, values);
             
        } catch (err) {
            console.error(err);
            throw new Error("Failed to insert user data into database :: " + err);
        }
    } catch (err) {
        console.error("Data insertion failed :: "+err);
    } finally {
        if (client) {
            client.release();
        }
    }
}

function generateUserCode(fullName, phoneNo) {
    const { rows } = client.query("SELECT nextval('ims_schema.user_code_seq')");
    const userCounter = rows[0].nextval;
    let formattedName = fullName
        .toLowerCase()
        .replace(/\s/g, "")
        .substring(0, 10);
    const userCode =
        formattedName +
        phoneNo.substring(phoneNo.length - 4) +
        String(userCounter).padStart(4, "0");
    return userCode;
}

function passwordHashing(password) {
    const saltRounds = 10;
    try {
        return bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error("Failed to hash password :: " + err);
        return null;
    }
}