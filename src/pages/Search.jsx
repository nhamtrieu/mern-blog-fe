import instance from "../axios/configAxios";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
    const localtion = useLocation();
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "asc",
        category: "uncategoryized",
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(localtion.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }
        const getPosts = async () => {
            try {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await instance.get(
                    `/api/v1/post/getposts?${searchQuery}`
                );
                setLoading(false);
                setPosts(res.data.posts);
                if (res.data.posts.length <= 9) setShowMore(false);
                else setShowMore(true);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        getPosts();
    }, [localtion.search]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await instance.get("/api/v1/post/getCategory");
                setListCategories(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getCategories();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(localtion.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("category", sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handelChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            });
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSidebarData({
                ...sidebarData,
                sort: order,
            });
        }
        if (e.target.id === "category") {
            const category = e.target.value || "uncategoryized";
            setSidebarData({
                ...sidebarData,
                category: category,
            });
        }
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(localtion.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        try {
            const res = await instance.get(
                `/api/v1/post/getposts?${searchQuery}`
            );
            setPosts([...posts, ...res.data.posts]);
            if (res.data.posts.length <= 9) setShowMore(false);
            else setShowMore(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form
                    action=""
                    className="flex flex-col gap-8"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="searchTerm"
                            className=" whitespace-nowrap font-semibold"
                        >
                            Search Term:
                        </label>
                        <TextInput
                            placeholder="Search..."
                            id="searchTerm"
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handelChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="searchTerm"
                            className=" whitespace-nowrap font-semibold"
                        >
                            Sort:
                        </label>
                        <Select
                            onChange={handelChange}
                            id="sort"
                            value={sidebarData.sort}
                        >
                            <option value="asc">Oldest</option>
                            <option value="desc">Newest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="searchTerm"
                            className=" whitespace-nowrap font-semibold"
                        >
                            Sort:
                        </label>
                        <Select
                            onChange={handelChange}
                            value={sidebarData.category}
                            id="category"
                        >
                            {listCategories &&
                                listCategories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category.charAt(0).toUpperCase() +
                                            category.slice(1)}
                                    </option>
                                ))}
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        outline
                        gradientDuoTone={"purpleToPink"}
                    >
                        Search
                    </Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
                    Result
                </h1>
                <div className="flex flex-wrap gap-4 p-7">
                    {!loading && posts.length === 0 && (
                        <p className="text-xl text-gray-500">No posts found</p>
                    )}
                    {loading && (
                        <p className=" text-xl text-gray-500">Loading...</p>
                    )}
                    {!loading &&
                        posts &&
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className=" text-teal-500 text-lg hover:underline p-7 w-full"
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
