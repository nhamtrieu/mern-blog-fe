import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import instance from "../axios/configAxios";

import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await instance.get("/api/v1/post/getposts");
                setPosts(res.data.posts);
            } catch (error) {
                console.log(error);
            }
        };
        getPosts();
    }, []);
    return (
        <div>
            <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">
                    Wellcome to my Blog
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm">
                    Here you'll find a variety of articles and tutorials on
                    topic such as web development, software engineering and
                    programing
                </p>
                <Link
                    to={"/search"}
                    className=" text-xs sm:text-sm text-teal-500 font-bold hover:underline"
                >
                    View all posts
                </Link>
                <div className="p-3 bg-amber-100 dark:bg-slate-700">
                    <CallToAction />
                </div>
            </div>
            <div className="flex flex-col gap-8 py-7 max-w-[90rem] mx-auto p-3">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className=" text-2xl font-semibold text-center">
                            Recent Posts
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center items-center">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link
                            to={"/search"}
                            className=" text-lg text-teal-500 hover:underline text-center"
                        >
                            View all posts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
