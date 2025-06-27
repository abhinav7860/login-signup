import * as yup from "yup";

// Schema for the Signup form
export const signupSchema = yup.object({
  name: yup
    .string()
    .required("Name is required"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords must match")
    .required("Please confirm your password"),
}).required();


// Schema for the Login form
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
}).required();