import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axios/configAxios";
import ReactQuill from "react-quill";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";

import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";

export default function UpdatePost() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publistError, setPublishError] = useState(null);
    const { postId } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        try {
            setPublishError(null);
            const getPost = async () => {
                const res = await instance.get(
                    `/api/v1/post/getposts?postId=${postId}`
                );
                setFormData(res.data.posts[0]);
            };
            getPost();
        } catch (error) {
            setPublishError(error.response.data.message);
        }
    }, [postId]);
    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please select an image");
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress);
                },
                (error) => {
                    setImageUploadError(error.message);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageUploadError(null);
                            setImageUploadProgress(null);
                            setFormData({ ...formData, image: downloadURL });
                        }
                    );
                }
            );
        } catch (error) {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await instance.put(
                `/api/v1/post/update/${formData._id}/${currentUser._id}`,
                formData
            );
            setPublishError(null);
            navigate(`/post/${res.data.slug}`);
        } catch (error) {
            setPublishError(error.response.data.message);
        }
    };
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="my-7 text-center text-3xl font-semibold">
                Update post
            </h1>
            <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        required
                        id="title"
                        className="flex-1"
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData?.title}
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                        value={formData?.category}
                    >
                        <option value={"uncategorized"}>
                            Select a category
                        </option>
                        <option value={"javascript"}>Javascript</option>
                        <option value={"react"}>React</option>
                        <option value={"node"}>Node</option>
                        <option value={"express"}>Express</option>
                        <option value={"mongo"}>Mongo</option>
                        <option value={"python"}>Python</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type="button"
                        gradientDuoTone={"purpleToBlue"}
                        size={"sm"}
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            "Upload"
                        )}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color={"failure"}>{imageUploadError}</Alert>
                )}
                {formData?.image && (
                    <img
                        src={formData?.image}
                        alt="preview"
                        className="w-full h-72 object-contain"
                    />
                )}
                <ReactQuill
                    theme="snow"
                    placeholder="Write somethings"
                    className="h-72 mb-12"
                    onChange={(value) =>
                        setFormData({ ...formData, content: value })
                    }
                    value={formData?.content}
                />
                <Button type="submit" gradientDuoTone={"purpleToBlue"}>
                    Update
                </Button>
                {publistError && (
                    <Alert color={"failure"}>{publistError}</Alert>
                )}
            </form>
        </div>
    );
}
