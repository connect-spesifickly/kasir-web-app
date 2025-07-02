import * as yup from "yup";

const technicianRegistrationSchema = () => {
  return yup.object().shape({
    name: yup.string().required("Name is required"),
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

export { technicianRegistrationSchema };
