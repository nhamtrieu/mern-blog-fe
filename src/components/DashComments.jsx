import instance from "../axios/configAxios";
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import moment from "moment";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");
    useEffect(() => {
        const getComments = async () => {
            try {
                const commentsData = await instance.get(
                    `/api/v1/comment/getcomments`
                );
                setComments(commentsData.data?.comments);
                if (commentsData.data?.comments.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            getComments();
        }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = commentIdToDelete.length;
        try {
            const res = await instance.get(
                `/api/v1/comments/getcomments?startIndex=${startIndex}`
            );
            setComments([...comments, ...res.data.comments]);
            if (res.data.comments.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await instance.delete(
                `/api/v1/comment/deleteComment/${commentIdToDelete}`
            );
            setComments((prev) =>
                prev.filter((comment) => comment._id !== commentIdToDelete)
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && comments.length > 0 ? (
                <div className="w-full">
                    <Table hoverable className="shadow-md w-full">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className="divide-y" key={comment._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {moment().format(
                                            comment.updatedAt,
                                            "YYYY-MM-DD HH:mm"
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setCommentIdToDelete(
                                                    comment._id
                                                );
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
                <p>You have no comments yet</p>
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
                            <Button
                                color="failure"
                                onClick={handleDeleteComment}
                            >
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
