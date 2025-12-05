import { useState } from "react";
import { type BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Blogs() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: blogs, isLoading, isError, error } = useQuery<BlogData[]>({
    queryKey: ["get-public-blogs"],
    queryFn: async () => {
      const response = await api.get("/public/blogs");
      return response.data.blogs;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <MainLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-10">
        Error: {(error as Error).message}
      </p>
    );
  }

  const handleBlogClick = async (blogId: string) => {
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate(`/blogs/${blogId}`);
    setIsNavigating(false);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 xl:columns-3 gap-6 space-y-6 p-4">
        {blogs?.map((blog) => (
          <article
            key={blog.id}
            className="
              break-inside-avoid
              group overflow-hidden rounded-3xl 
              border border-border/70 
              bg-card shadow-sm hover:shadow-xl 
              hover:border-border 
              transition-all duration-300 hover:-translate-y-2
              cursor-pointer
            "
            onClick={() => handleBlogClick(blog.id)}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-t-3xl">
              <img
                src={blog.featuredImageUrl ?? "https://picsum.photos/seed/placeholder/600/360"}
                alt={blog.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
              </p>

              <h2 className="text-xl font-semibold leading-tight line-clamp-2">
                {blog.title}
              </h2>

              {blog.author && (
                <p className="text-sm text-muted-foreground">
                  By {blog.author.firstName} {blog.author.lastName}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <MainLoader />
        </div>
      )}
    </>
  );
}
