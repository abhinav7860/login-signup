import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signupSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";

import InputField from "../components/InputField";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";
import AuthLayout from "../components/AuthLayout";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema), // Feature: Using yup for validation
  });

  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password);
      localStorage.setItem("authAction", "signup");
      toast.success("Signup complete! 🎉");
      navigate("/success");
    } catch (err) {
      // Feature: Handle and display backend error responses
      let msg = "An error occurred during signup.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
        // Set an error on the specific form field for direct feedback
        setError("email", { type: "server", message: msg });
      } else {
        // Set a general form error for other issues
        setError("root.serverError", { type: "server", message: msg });
      }
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Sign Up
        </h2>

        {/* Feature: Validation error messages are handled by these components */}
        <InputField 
            name="name" 
            placeholder="Full Name" 
            register={register} 
            error={errors.name} 
            disabled={isSubmitting}
        />
        <InputField 
            name="email" 
            type="email" 
            placeholder="Email" 
            register={register} 
            error={errors.email} 
            disabled={isSubmitting}
        />
        <PasswordInput 
            name="password" 
            placeholder="Password" 
            register={register} 
            error={errors.password} 
            disabled={isSubmitting}
        />
        <PasswordInput 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            register={register} 
            error={errors.confirmPassword} 
            disabled={isSubmitting}
        />

        {/* Display for general backend errors */}
        {errors.root?.serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {errors.root.serverError.message}
          </div>
        )}

        {/* Feature: Show loading indicator on submit */}
        <SubmitButton 
            loading={isSubmitting} 
            text="Create Account" 
            loadingText="Creating account..."
        />

        <p className="text-center text-sm mt-4 text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}