"use client";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import * as React from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const validationSchema = yup.object({
  email: yup.string().email().required("email field cannot be empty"),
});

interface FormValues {
  email: string;
}

export default function ForgotPasswordRequest() {
  const [isRequest, setIsRequest] = React.useState(false);
  const router = useRouter();

  const initialValues: FormValues = {
    email: "",
  };

  async function handleSubmit(values: FormValues) {
    setIsRequest(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        redirect: false,
      });
      if (result?.error) {
        console.error(result.error);
      } else {
        toast("Request success");
        router.push("/dashboard");
      }
    } catch (error) {
      toast("Request Failed");
      console.error(error);
    } finally {
      setIsRequest(false);
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
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    placeholder="e.g. user@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 font-normal text-gray-900"
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                disabled={isRequest}
                type="submit"
                className="w-full text-slate-50"
              >
                Request
              </Button>
            </Form>
          )}
        </Formik>
        <p className="font-normal text-[14px] text-sm text-slate-600">
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
