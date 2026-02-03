import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { setCredentials, setFirebaseToken } from "../store/authSlice";
import { API_URL } from "../config";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken =
        result?.user?.accessToken || (await result.user.getIdToken());

      if (!idToken) {
        throw new Error("No ID token returned from Firebase.");
      }

      localStorage.setItem("firebase-id-token", idToken);
      dispatch(setFirebaseToken(idToken));

      const { email, displayName, photoURL } = result.user || {};

      console.log("🔌 Sending token to backend...");
      const syncResponse = await axios.post(`${API_URL}/auth/google-sync`, {
        token: idToken,
        email,
        displayName,
        photoURL,
      });

      console.log("✅ Backend Response:", syncResponse.data);

      const responseData = syncResponse.data || {};
      const token = responseData.token || null;
      const user = responseData.user || responseData;
      if (!user || !user.email) {
        throw new Error("Backend response is missing 'user'");
      }
      if (!token) {
        console.warn("Backend response is missing 'token'");
      }

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("auth-token", token);
      }
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setCredentials({ token, user }));

      console.log("Firebase ID Token:", idToken);
      navigate("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="google-login-button"
    >
      <span className="google-login-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path
            fill="#EA4335"
            d="M24 9.5c3.48 0 6.6 1.21 9.05 3.58l6.74-6.74C35.91 2.57 30.37 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.86 6.1C12.3 13.23 17.73 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.6-.14-2.77-.45-4H24v7.58h12.92c-.26 2.06-1.67 5.17-4.8 7.25l7.37 5.72c4.29-3.96 7.01-9.78 7.01-16.55z"
          />
          <path
            fill="#FBBC05"
            d="M10.42 28.82A14.5 14.5 0 0 1 9.5 24c0-1.69.3-3.32.85-4.82l-7.86-6.1A23.95 23.95 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l7.86-5.96z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.37 0 11.73-2.1 15.64-5.72l-7.37-5.72c-2 1.39-4.69 2.36-8.27 2.36-6.27 0-11.7-3.73-13.58-8.9l-7.86 5.96C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      </span>
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleLogin;
