"use client";
import { Logo } from "@/components/ui/logo";
import * as React from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input/password-input";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/axios";

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [isResetPassword, setIsResetPassword] = React.useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;
  const initialValues: FormValues = {
    newPassword: "",
    confirmPassword: "",
  };

  async function handleSubmit(values: FormValues) {
    setIsResetPassword(true);
    console.log("Submittzing ResetPassword with values:", values);
    try {
      await api.post("/auth/reset-password", {
        newPassword: values.newPassword,
        token: token,
        redirect: false,
      });

      toast("Reset Password success");
      router.push("/");
    } catch (error) {
      toast("Reset Password Failed");
      console.error(error);
    } finally {
      setIsResetPassword(false);
    }
  }

  return (
    <div className="sm:bg-gray-100 bg-white w-full h-[100vh] flex justify-center items-center">
      <div className=" bg-white rounded-[12px] w-[400px] flex flex-col items-center py-[40px] px-[16px] gap-[24px]">
        <Logo className="w-[134px] h-[24px]" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form className="flex flex-col gap-[24px] w-full">
              <div className="flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-medium">New Password</label>
                  <PasswordInput
                    name="newPassword"
                    placeholder="e.g. yourpassword1945"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 font-normal text-gray-900"
                  />
                  {errors.newPassword && touched.newPassword && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="e.g. yourpassword1945"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 font-normal text-slate-900"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <Button
                disabled={isResetPassword}
                type="submit"
                className="w-full text-slate-50"
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
        <p className="font-normal text-[14px] text-sm text-slate-600">
          <Link href="/login" className="text-blue-600 font-semibold">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}
