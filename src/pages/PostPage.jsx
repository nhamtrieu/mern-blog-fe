import instance from "../axios/configAxios";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [post, setPost] = useState({});
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const getPost = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await instance.get(
                    `/api/v1/post/getposts?slug=${postSlug}`
                );
                setPost(res.data.posts[0]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(true);
                console.log(error);
            }
        };
        getPost();
    }, [postSlug]);

    useEffect(() => {
        try {
            const getRecentPosts = async () => {
                const res = await instance.get("/api/v1/post/getposts?limit=3");
                setRecentPosts(res.data.posts);
            };
            getRecentPosts();
        } catch (error) {
            console.log(error);
        }
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl">Loading...</Spinner>
            </div>
        );
    return (
        <main className="p-3 flex flex-col max-w-7xl mx-auto min-h-screen">
            <h1 className="p-3 text-3xl mt-10 text-center max-w-2xl mx-auto lg:text-4xl">
                {post && post.title}
            </h1>
            <Link
                to={`/search?category=${post.category}`}
                className="mt-5 self-center"
            >
                <Button color="gray" pill size={"xs"}>
                    {post && post.category}
                </Button>
            </Link>
            <img
                src={post && post.image}
                alt={post && post.title}
                className="mt-10 p-3 max-h-[600px] w-[60%] object-cover mx-auto"
            />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>
                    {post && new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="italic">
                    {post && (post.content?.length / 1000).toFixed(0) < 1
                        ? 1
                        : (post.content?.length / 1000).toFixed(0)}{" "}
                    {`min${
                        (post.content?.length / 1000).toFixed(0) > 1 ? "s" : ""
                    } read`}
                </span>
            </div>
            <div
                className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{
                    __html: post && DOMPurify.sanitize(post.content),
                }}
            ></div>
            <div className="mx-auto max-w-4xl w-full">
                <CallToAction />
            </div>
            <CommentSection postId={post._id} />
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent articales</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentPosts &&
                        recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                </div>
            </div>
        </main>
    );
}
