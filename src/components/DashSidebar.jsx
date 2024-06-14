import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
    HiAnnotation,
    HiArrowSmRight,
    HiChartPie,
    HiDocumentText,
    HiOutlineUserGroup,
    HiUser,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signInFailure, signoutSuccess } from "../redux/user/userSlice";
import instance from "../axios/configAxios";

export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { isAdmin } = currentUser;
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    const handleSignout = async () => {
        try {
            const res = await instance.post("/api/v1/user/signout");
            dispatch(signoutSuccess());
        } catch (error) {
            console.log(error);
            dispatch(signInFailure(error?.response?.data?.message));
        }
    };
    return (
        <Sidebar className="w-full">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item
                                active={tab === "dash" || !tab}
                                icon={HiChartPie}
                                labelColor="dark"
                                as="div"
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={HiUser}
                            label={isAdmin ? "Admin" : "User"}
                            labelColor="dark"
                            as="div"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <>
                            <Link to="/dashboard?tab=posts">
                                <Sidebar.Item
                                    active={tab === "posts"}
                                    icon={HiDocumentText}
                                    labelColor="dark"
                                    as="div"
                                >
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=users">
                                <Sidebar.Item
                                    active={tab === "users"}
                                    icon={HiOutlineUserGroup}
                                    labelColor="dark"
                                    as="div"
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=comments">
                                <Sidebar.Item
                                    active={tab === "comments"}
                                    icon={HiAnnotation}
                                    labelColor="dark"
                                    as="div"
                                >
                                    Comments
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}

                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className=" cursor-pointer"
                        labelColor="dark"
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
