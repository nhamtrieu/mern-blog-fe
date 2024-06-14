import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import instance from "../axios/configAxios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const { data: res } = await instance.post("/api/v1/auth/google", {
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            });

            dispatch(signInSuccess(res));
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Button
            type="button"
            gradientDuoTone={"pinkToOrange"}
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" /> Sign In with Google
        </Button>
    );
}
