import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axios/configAxios";

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import OAuth from "../components/OAuth";

export default function Signup() {
    const [formData, setFormData] = useState({});
    const [errorMessages, setErrorMessages] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessages("Please fill all fields");
        }
        try {
            setLoading(true);
            setErrorMessages(null);
            const res = await instance.post("/api/v1/auth/sign-up", formData);
            if (res.data?.success === false) {
                return setErrorMessages(res.data?.message);
            }
            setLoading(false);
            navigate("/sign-in");
        } catch (error) {
            setErrorMessages(error.message);
            setLoading(false);
        }
    };

    return (
        <div className=" min-h-screen mt-20">
            <div className="flex max-w-3xl p-3 mx-auto flex-col md:flex-row md:items-center gap-5">
                <div className="flex-1">
                    <Link
                        to={"/"}
                        className="text-4xl font-semibold dark:text-white"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Nham&apos;s
                        </span>{" "}
                        Blog
                    </Link>
                    <p className=" text-sm mt-5">
                        This is demo project. You can sign up with your email
                        and password or with Google
                    </p>
                </div>
                <div className="flex-1">
                    <form
                        action=""
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div>
                            <Label value="Your username" htmlFor="username" />
                            <TextInput
                                type="text"
                                placeholder="Username"
                                id="username"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Your email" htmlFor="email" />
                            <TextInput
                                type="email"
                                placeholder="Email"
                                id="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Your password" htmlFor="password" />
                            <TextInput
                                type="password"
                                placeholder="Password"
                                id="password"
                                onChange={handleChange}
                            />
                        </div>
                        <Button
                            gradientDuoTone={"purpleToPink"}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size={"sm"} />{" "}
                                    <span className="pl-3">Loading...</span>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an account</span>
                        <Link to={"/sign-in"} className="text-blue-500">
                            Sign In
                        </Link>
                    </div>
                    {errorMessages && (
                        <Alert className="mt-5" color={"failure"}>
                            {errorMessages}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
