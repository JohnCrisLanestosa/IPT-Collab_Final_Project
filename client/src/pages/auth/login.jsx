import CommonForm from "@/components/common/form";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import RecaptchaComponent from "@/components/auth/recaptcha";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleRecaptchaVerify = (token) => {
    setRecaptchaToken(token);
  };

  function onSubmit(event) {
    event.preventDefault();

    // Check if reCAPTCHA is verified
    if (!recaptchaToken) {
      toast({
        title: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return;
    }

    // Include reCAPTCHA token in login data
    const loginData = {
      ...formData,
      recaptchaToken,
    };

    dispatch(loginUser(loginData)).then((data) => {
      if (data?.payload?.success) {
        // Store login data for useEffect to handle navigation
        setLoginSuccess(data.payload);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  // Handle post-login navigation with appropriate message
  useEffect(() => {
    if (loginSuccess) {
      const isFirstLogin = loginSuccess.isFirstLogin;
      const userRole = loginSuccess.user?.role;
      
      // Determine redirect path based on user role
      if (userRole === "admin") {
        // Admin user - redirect to admin dashboard
        navigate("/admin/products");
      } else {
        // Regular user - redirect to shop
        if (isFirstLogin) {
          // First time login - redirect with welcome message
          navigate(
            `/shop/home?success=first_login&message=${encodeURIComponent(
              "Welcome! You've successfully created your account and logged in."
            )}`
          );
        } else {
          // Returning user - redirect with welcome back message
          navigate(
            `/shop/home?success=login&message=${encodeURIComponent(
              "Welcome back! You've logged in successfully."
            )}`
          );
        }
      }
      
      // Reset loginSuccess
      setLoginSuccess(null);
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Google Sign-in Button */}
      <GoogleSignInButton from="login" />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      {/* reCAPTCHA */}
      <RecaptchaComponent onVerify={handleRecaptchaVerify} />
    </div>
  );
}

export default AuthLogin;
