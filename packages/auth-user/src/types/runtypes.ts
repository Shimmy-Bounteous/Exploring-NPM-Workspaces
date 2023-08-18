import { String, Number, InstanceOf, Record, Optional } from 'runtypes';

// Runtype for request body with DOB
const RequestBodyForSignup = Record({
    name: String,
    dob: Optional(InstanceOf(Date)),
    phoneNo: Number,
    email: String,
    password: String
});

// Runtype for request body for Login
const RequestBodyForLogin = Record({
    email: String,
    password: String
});

export { RequestBodyForSignup, RequestBodyForLogin };