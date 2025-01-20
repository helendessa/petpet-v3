import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
    const getPostEndpoint = (feedType, username) => {
        switch (feedType) {
            case "forYou":
                return "/api/posts/all";
            case "following":
                return "/api/posts/following";
            case "posts":
                return `/api/posts/user/${username}`;
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POST_ENDPOINT = getPostEndpoint(feedType, username);

    const { data: posts, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["posts", feedType, username],
        queryFn: async () => {
            const res = await fetch(POST_ENDPOINT);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            return data;
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, username, refetch]);

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <p className='text-center my-4'>Nenhuma publicação aqui!</p>
            )}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;