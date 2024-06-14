import instance from "../axios/configAxios";
import { useEffect, useState } from "react";
import moment from "moment";

import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState({});
    const [editedContent, setEditedContent] = useState(comment.content);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await instance.get(
                    `/api/v1/user/${comment.userId}`
                );
                setUser(user.data);
            } catch (error) {
                setUser({});
            }
        };
        getUser();
    }, [comment.userId]);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSaveEditComment = async () => {
        try {
            const res = await instance.put(
                `/api/v1/comment/editComment/${comment._id}`,
                {
                    content: editedContent,
                }
            );
            onEdit(comment, res.data.content);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="mr-3 flex-shrink-0">
                <img
                    src={user.profilePicture}
                    alt="user"
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="mr-1 font-bold text-xs truncate">
                        {user ? `@${user.username}` : "anonimous user"}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAd).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            value={editedContent}
                            className="mb-2"
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end items-center">
                            <Button
                                type="button"
                                size={"sm"}
                                gradientDuoTone={"purpleToBlue"}
                                onClick={handleSaveEditComment}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                size={"sm"}
                                gradientDuoTone={"purpleToBlue"}
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="pb-2 text-gray-500">{comment.content}</p>
                        <div className="flex items-center pt-2 text-xs border-t dark:border-t-gray-700 max-w-fit gap-2">
                            <button
                                type="button"
                                className={`text-gray-400 hover:text-blue-500 ${
                                    currentUser &&
                                    comment.likes.includes(currentUser._id) &&
                                    "!text-blue-500"
                                }`}
                                onClick={() => onLike(comment._id)}
                            >
                                <FaThumbsUp />
                            </button>

                            <p className="text-gray-400">
                                {comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes +
                                        " " +
                                        (comment.numberOfLikes === 1
                                            ? "like"
                                            : "likes")}
                            </p>
                            {currentUser &&
                                (currentUser._id === comment.userId ||
                                    currentUser.isAdmin) && (
                                    <>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-blue-500"
                                            onClick={handleEditClick}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-red-500"
                                            onClick={() =>
                                                onDelete(comment._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
