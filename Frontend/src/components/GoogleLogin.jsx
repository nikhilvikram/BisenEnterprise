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
      <span className="google-login-icon">G</span>
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleLogin;
