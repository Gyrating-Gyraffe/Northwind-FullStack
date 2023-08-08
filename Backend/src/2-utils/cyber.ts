import { Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import UserModel from "../4-models/user-model";
import crypto from "crypto";


const jwtSecretKey = "JohnBryceFullStackCourse";

function getNewToken(user: UserModel): string {
    // Remove password from token:
    delete user.password;

    const container = { user };
    const options = { expiresIn: "3h" };
    const token = jwt.sign(container, jwtSecretKey, options);
    return token;
}

function verifyToken(request: Request): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            const header = request.header("authorization");
            if (!header) {
                resolve(false);
                return;
            }
            const token = header.substring(7);
            if (!token) {
                resolve(false);
                return;
            }
            jwt.verify(token, jwtSecretKey, (err: JsonWebTokenError) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        }
        catch (err: any) {
            reject(err);
        }
    });
}

// Hash salt:
const hashSalt = "MakeThingsGoRight";

// SHA - Secure Hashing Algorithm
// HMAC - Hash based Message Authentication Code

// Hash password:
function hashPassword(plainText: string): string {
    if(!plainText) return null;

    // Hash without salting:
    //const hashedPassword = crypto.createHash("sha512").update(plainText).digest("hex");

    // Hash with salting:
    const hashedPassword = crypto.createHmac("sha512", hashSalt).update(plainText).digest("hex");

    return hashedPassword;
}

export default {
    getNewToken,
    verifyToken,
    hashPassword
};
