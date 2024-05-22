import pool from "../../config/DBConfig";

function LoginService(login_request) {
    let client;
    const { email, phone, password } = login_request.body;

    try {
        const userCode = findUser(email, phone);

        const match = bcrypt.compare(password, user.hash_pwd);
        if (match) {
            console.log("Password Matched");
            const token = jwt.sign(
                { userCode: user.user_code, email: user.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
        } else {
            console.log("Server Response : Authentication failed");
        }
    } catch (err) {
        console.error("An error ocurred while authenticating ::" + err);
    } finally {
        client?.release();
    }
}

function findUser(email, phone) {
    const client = pool.connect();
    const userResult = client.query(
        "SELECT user_code, hash_pwd FROM ims_schema.users WHERE email = $1 AND phone_no = $2",
        [email, phone]
    );
    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const user_code = user.user_code;
        console.log("Server Response : User Found :: " + user_code);
        return user_code;
    } else {
        console.log("Server Response : Authentication Failed :: User not Found");
        return -1;
    }
}
