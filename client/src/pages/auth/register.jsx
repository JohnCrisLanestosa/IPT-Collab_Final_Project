import CommonForm from "@/components/common/form";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import RecaptchaComponent from "@/components/auth/recaptcha";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleRecaptchaVerify = (token) => {
    setRecaptchaToken(token);
  };

  //check if the user is already exist
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

    // Include reCAPTCHA token in registration data
    const registrationData = {
      ...formData,
      recaptchaToken,
    };

    dispatch(registerUser(registrationData)).then((data) => {
      if (data?.payload?.success) {
        // User is now automatically logged in, redirect to home with welcome message
        navigate(
          `/shop/home?success=signup&message=${encodeURIComponent(
            "Welcome! Your account has been created successfully."
          )}`
        );
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  console.log(formData);

  // Check for info messages (e.g., when redirected from login as new user)
  useEffect(() => {
    const infoType = searchParams.get("info");
    const message = searchParams.get("message");

    if (infoType === "new_user" && message) {
      toast({
        title: decodeURIComponent(message),
        variant: "default",
      });

      // Clean up URL parameters
      setSearchParams({});
    }
  }, [searchParams, toast, setSearchParams]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Google Sign-in Button */}
      <GoogleSignInButton from="register" />

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
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* reCAPTCHA */}
      <RecaptchaComponent onVerify={handleRecaptchaVerify} />
    </div>
  );
}

export default AuthRegister;
