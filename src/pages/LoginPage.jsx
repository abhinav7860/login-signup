import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout"; // Use the layout
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      localStorage.setItem("authAction", "login");
      toast.success("Login successful!");
      navigate("/success");
    } catch (err) {
      // ... error handling logic is unchanged
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(handleLogin)}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Log In
        </h2>

        <InputField name="email" type="email" placeholder="Email" register={register} error={errors.email} disabled={isSubmitting}/>
        <InputField name="password" type="password" placeholder="Password" register={register} error={errors.password} disabled={isSubmitting}/>

        {errors.root?.serverError && (
          <p className="text-red-500 text-sm mb-4 text-center">{errors.root.serverError.message}</p>
        )}

        <SubmitButton loading={isSubmitting} text="Log In" loadingText="Signing in..."/>

        <p className="text-center text-sm mt-4 text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}