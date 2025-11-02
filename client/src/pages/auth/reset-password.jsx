import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { verifyResetToken, resetPassword } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verify token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await dispatch(verifyResetToken(token)).unwrap();
        
        if (result.success) {
          setIsValidToken(true);
          setUserEmail(result.email || "");
        } else {
          setIsValidToken(false);
          toast({
            title: "Invalid or Expired Link",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        setIsValidToken(false);
        toast({
          title: "Verification Failed",
          description: "Unable to verify reset token",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsVerifying(false);
      setIsValidToken(false);
    }
  }, [token, dispatch, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(
        resetPassword({ token, password })
      ).unwrap();

      if (result.success) {
        setResetSuccess(true);
        toast({
          title: "Success!",
          description: result.message,
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      } else {
        toast({
          title: "Reset Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Invalid or Expired Link
          </h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired. Password reset
            links are only valid for 1 hour.
          </p>
          <div className="space-y-2 pt-4">
            <Link to="/auth/forgot-password">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Password Reset Successful!
          </h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <p className="text-green-800">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
          <Link to="/auth/login">
            <Button className="w-full">Go to Login Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Your Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          {userEmail && (
            <>
              Creating new password for{" "}
              <span className="font-semibold text-foreground">{userEmail}</span>
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {password && confirmPassword && (
          <div
            className={`text-sm p-2 rounded ${
              password === confirmPassword
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;

