import { useState } from "react";
import { type BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, ArrowRight, BookOpen, TrendingUp } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <MainLoader />
          <p className="mt-4 text-blue-600 font-medium">Loading amazing blogs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-4">Error: {(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Explore our collection of insightful articles, tutorials, and perspectives from talented writers.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>{blogs?.length || 0} Articles</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <User className="w-4 h-4" />
                <span>Expert Writers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {blogs?.map((blog) => (
            <article
              key={blog.id}
              className="
                break-inside-avoid
                group overflow-hidden rounded-2xl 
                bg-white shadow-lg hover:shadow-2xl 
                border border-blue-100 hover:border-blue-200
                transition-all duration-300 hover:-translate-y-2
                cursor-pointer
              "
              onClick={() => handleBlogClick(blog.id)}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={blog.featuredImageUrl ?? "https://picsum.photos/seed/placeholder/600/360"}
                    alt={blog.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 right-4">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : ""}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {blog.title}
                </h2>

                {/* Author */}
                {blog.author && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>
                      By {blog.author.firstName} {blog.author.lastName}
                    </span>
                  </div>
                )}

                {/* Read More */}
                <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-200">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-blue-600 font-medium">Opening blog...</p>
          </div>
        </div>
      )}
    </>
  );
}
