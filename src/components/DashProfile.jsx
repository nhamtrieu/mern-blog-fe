import instance from "../axios/configAxios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    deleUserStart,
    deleUserSuccess,
    signInFailure,
    signInSuccess,
    updateFailure,
    updateStart,
    updateSuccess,
} from "../redux/user/userSlice";

export default function DashProfile() {
    const dispatch = useDispatch();
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUpdloading, setImageFileUpdloading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const handleOnchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploadError(null);
        setImageFileUpdloading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const process =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(process.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    "Cannot upload image (File must be less than 2MB)"
                );
                setImageFileUploadProgress(0);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUpdloading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                    setFormData({ ...formData, profilePicture: downloadUrl });
                    setImageFileUpdloading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (
            Object.keys(formData).length === 0 ||
            Object.keys(formData).filter((key) => !key).length ===
                Object.keys(formData).length
        ) {
            setUpdateUserError("No changes made");
            return;
        }
        if (imageFileUpdloading) {
            setUpdateUserError("Please wait until image is uploaded");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await instance.put(
                `/api/v1/user/update/${currentUser._id}`,
                formData
            );
            dispatch(updateSuccess(res.data));
            setUpdateUserSuccess("User updated successfully");
        } catch (error) {
            console.log(error);
            dispatch(updateFailure(error.response.data.message));
            setUpdateUserError(error.response.data.message);
        }
    };

    const handleDeleUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleUserStart());
            const res = await instance.delete(
                `/api/v1/user/delete/${currentUser._id}`
            );
            dispatch(deleUserSuccess(res.data));
        } catch (error) {
            dispatch(updateFailure(error.response.data.message));
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await instance.post("/api/v1/user/signout");
            dispatch(signInSuccess());
        } catch (error) {
            console.log(error);
            dispatch(signInFailure(error.response.data.message));
        }
    };

    return (
        <div className=" max-w-lg mx-auto p-3 w-full relative">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form
                action=""
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleOnchange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className="relative w-32 h-32 self-center cursor-pointer shadow-sm rounded-full"
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress !== 0 && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                            imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            "opacity-50"
                        }`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color={"failure"}>{imageFileUploadError}</Alert>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="password"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    gradientDuoTone={"purpleToBlue"}
                    outline
                    disabled={loading || imageFileUpdloading}
                >
                    {loading || imageFileUpdloading ? "Loading..." : "Update"}
                </Button>
                {currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <Button
                            type="button"
                            gradientDuoTone={"purpleToPink"}
                            className="w-full"
                        >
                            Create a new post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="flex text-red-500 justify-between">
                <span
                    className="cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    Delete Account
                </span>
                <span className="cursor-pointer" onClick={handleSignOut}>
                    Sign Out
                </span>
            </div>
            {updateUserSuccess && (
                <Alert color={"success"} className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color={"failure"} className="mt-5">
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color={"failure"} className="mt-5">
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 to-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-xl text-gray-500 dark:text-gray-200">
                            Are you sure you want to delete your accout
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleUser}>
                                Yes, I'm sure
                            </Button>
                            <Button onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
