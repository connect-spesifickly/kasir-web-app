import * as yup from "yup";

const ownerLoginSchema = () => {
  return yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .optional()
      .min(8, "Password must be at least 8 characters"),
  });
};

export { ownerLoginSchema };
