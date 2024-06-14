import instance from "../axios/configAxios";
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUser() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");
    useEffect(() => {
        const getUser = async () => {
            try {
                const usersData = await instance.get(`/api/v1/user/getusers`);
                setUsers(usersData.data?.users);
                if (usersData.data?.users.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            getUser();
        }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await instance.get(
                `/api/v1/user/getusers?startIndex=${startIndex}`
            );
            setUsers([...users, ...res.data.users]);
            if (res.data.users.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await instance.delete(
                `/api/v1/user/delete/${userIdToDelete}`
            );
            setUsers((prev) =>
                prev.filter((user) => user._id !== userIdToDelete)
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && users.length > 0 ? (
                <div className="w-full">
                    <Table hoverable className="shadow-md w-full">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body className="divide-y" key={user._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(
                                            user.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="w-10 h-10 object-cover bg-gray-50 rounded-full"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setUserIdToDelete(user._id);
                                                setShowModal(true);
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-7"
                        >
                            Show more
                        </button>
                    )}
                </div>
            ) : (
                <p>You have no user yet</p>
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
                            Are you sure you want to delete this user
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
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
