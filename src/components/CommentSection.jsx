import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import instance from "../axios/configAxios";

import Comment from "./Comment";

import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
    const nagigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentDelete, setCommentDelete] = useState(null);

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await instance.get(
                    `/api/v1/comment/getPostComments/${postId}`
                );
                setComments(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim().length > 200 || comment.trim().length < 1) {
            setCommentError("Comment must be between 1 and 200 characters");
            return;
        }
        try {
            setCommentError(null);
            const res = await instance.post("/api/v1/comment/create", {
                userId: currentUser._id,
                postId,
                content: comment.trim(),
            });
            setComment("");
            setComments([...comments, res.data]);
        } catch (error) {
            setComment("");
            setCommentError(error.response.data.message);
            console.log(error);
        }
    };

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                nagigate("/sign-in");
                return;
            }
            const res = await instance.put(
                `/api/v1/comment/likeComment/${commentId}`
            );
            setComments(
                comments.map((comment) =>
                    comment._id === commentId
                        ? {
                              ...comment,
                              likes: res.data.likes,
                              numberOfLikes: res.data.numberOfLikes,
                          }
                        : comment
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    };

    const handleDelete = async (commentId) => {
        try {
            if (!currentUser) {
                nagigate("/sign-in");
                return;
            }
            const res = await instance.delete(
                `/api/v1/comment/deleteComment/${commentId}`
            );
            setComments(comments.filter((c) => c._id !== commentId));
            setShowModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-3 w-full max-w-2xl mx-auto">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img
                        className="h-5 w-5 object-cover rounded-full"
                        src={currentUser.profilePicture}
                        alt=""
                    />
                    <Link
                        className="text-xs text-cyan-500 hover:underline"
                        to={`/dashboard?tab=profile`}
                    >
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    <p>Sign in to comment</p>
                    <Link
                        to="/sign-in"
                        className="text-blue-500 hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            )}
            {currentUser && (
                <form
                    className="border border-teal-500 rounded-md p-3"
                    onSubmit={handleSubmit}
                >
                    <Textarea
                        placeholder="Add a comment..."
                        rows={3}
                        maxLength={200}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex items-center justify-between mt-5">
                        <p className="text-gray-500">
                            {200 - comment.length} characters remaining
                        </p>
                        <Button
                            outline
                            gradientDuoTone={"purpleToBlue"}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color={"failure"} className="mt-5">
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}
            {comments.length === 0 ? (
                <p className="text-sm my-5">No comments yet!</p>
            ) : (
                <>
                    <div className="flex items-center text-sm my-5 gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments &&
                        comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onLike={handleLike}
                                onEdit={handleEdit}
                                onDelete={(commentId) => {
                                    setShowModal(true);
                                    setCommentDelete(commentId);
                                }}
                            />
                        ))}
                </>
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
                            Are you sure you want to delete this comment
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => handleDelete(commentDelete)}
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
