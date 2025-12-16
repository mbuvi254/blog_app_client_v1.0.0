import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BlogLayout from "./BlogLayout";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../../Store/userStore";
import toastUtils from "../../lib/toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Calendar, User, ArrowLeft, MessageCircle, Heart, Share2, Bookmark, Clock } from "lucide-react";

interface CommentData {
  id: string;
  userId: string;
  blogId: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }
}

const ReadBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { id: userId, emailAddress, setUser, clearUser } = useUserStore();
  const isLoggedIn = !!userId;

  const [commentText, setCommentText] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-blog", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/public/blogs/${id}`);
      return response.data.blog;
    },
    enabled: !!id,
  });

  const { data: comments, isLoading: commentsLoading, isError: commentsIsError, error: commentsFetchError } = useQuery({
    queryKey: ["get-blog-comments", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await api.get(`/public/comments/${id}`);
      return res.data.comments || [];
    },
    enabled: !!id,
  });

const commentMutation = useMutation({
  mutationFn: async (payload: { blogId: string; comment: string }) => {
    const res = await api.post("/blogs/comments", payload);
    return res.data;
  },

  onMutate: () => {
    toastUtils.loading("Posting comment...");
  },

  onSuccess: () => {
    toastUtils.dismiss();
    toastUtils.success("Comment posted!", "Your comment is now visible");
    queryClient.invalidateQueries({ queryKey: ["get-blog-comments", id] });
    setCommentText("");
  },

  onError: (error: any, variables) => {
    toastUtils.dismiss();
    const message =
      error?.response?.data?.message || error?.message || "Failed to post comment";
    toastUtils.error("Comment failed", message, "Retry", () => {
      commentMutation.mutate(variables);
    });
  },
});



  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.data);
      } catch {
        clearUser();
      }
    };
    checkAuthStatus();
  }, [setUser, clearUser]);



const handleComment = (e: React.FormEvent) => {
  e.preventDefault();

  if (commentMutation.isPending) return;

  if (!id || !isLoggedIn) {
    toastUtils.general.unauthorized(() => navigate("/login"));
    return;
  }

  if (!commentText.trim()) {
    toastUtils.auth.validationError("Comment cannot be empty");
    return;
  }

  commentMutation.mutate({
    blogId: id,
    comment: commentText.trim(),
  });
};




  if (isLoading) return <MainLoaderWrapper />;
  if (isError) return <ErrorWrapper navigate={navigate} message={(error as Error).message} />;
  if (!data) return <ErrorWrapper navigate={navigate} message="Blog not found." />;

  return (
    <BlogLayout title={data.title} subtitle="Deep dive into our latest story">
      <div className="space-y-10">
        <BackButton navigate={navigate} />
        <BlogContent blog={data} />
        <CommentsSection
          comments={comments}
          commentsLoading={commentsLoading}
          commentsIsError={commentsIsError}
          commentsFetchError={commentsFetchError}
          commentText={commentText}
          setCommentText={setCommentText}
          handleComment={handleComment}
          commentMutation={commentMutation}
        />
      </div>

      {commentMutation.isPending && <FullScreenLoader />}
    </BlogLayout>
  );
};

export default ReadBlog;

const MainLoaderWrapper = () => (
  <div className="h-[60vh] flex justify-center items-center">
    <MainLoader />
  </div>
);

const ErrorWrapper = ({ navigate, message }: { navigate: any; message: string }) => (
  <BlogLayout title="Error">
    <p className="text-center text-red-500 mt-10">{message}</p>
    <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">
      Go back
    </button>
  </BlogLayout>
);

const BackButton = ({ navigate }: { navigate: any }) => (
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to blogs
  </button>
);

const BlogContent = ({ blog }: { blog: any }) => (
  <article className="max-w-4xl mx-auto">
    {/* Blog Header */}
    <header className="mb-8">
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">
            {blog.author?.firstName} {blog.author?.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <time>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>5 min read</span>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {blog.title}
      </h1>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          <span>Article</span>
        </div>
        {blog.isPublished && (
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Published
          </div>
        )}
      </div>
    </header>

    {/* Featured Image */}
    {blog.featuredImageUrl && (
      <div className="mb-8">
        <img 
          src={blog.featuredImageUrl} 
          alt={blog.title} 
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />
      </div>
    )}

    {/* Blog Content */}
    <div className="prose prose-lg max-w-none">
      <div className="text-lg leading-relaxed text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-50 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-a:text-blue-600 hover:prose-a:text-blue-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-gray-200">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
        <Heart className="w-4 h-4" />
        <span>Like</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200">
        <Bookmark className="w-4 h-4" />
        <span>Save</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200">
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  </article>
);

const CommentsSection = ({
  comments,
  commentsLoading,
  commentsIsError,
  commentsFetchError,
  commentText,
  setCommentText,
  handleComment,
  commentMutation,
}: any) => (
  <section className="max-w-4xl mx-auto mt-16 space-y-8">
    <header className="text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Comments</h2>
      </div>
      <p className="text-gray-600">Join the discussion and share your thoughts</p>
    </header>

    <div className="space-y-6">
      {commentsLoading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      )}
      
      {commentsIsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load comments: {String(commentsFetchError?.message)}</p>
        </div>
      )}
      
      {!commentsLoading && comments?.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No comments yet</p>
          <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
        </div>
      )}

      {comments?.map((comment: CommentData) => (
        <article key={comment.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-900">
                  {comment.user?.username || comment.user?.firstName || "Unknown"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
            </div>
          </div>
        </article>
      ))}
    </div>

    <form onSubmit={handleComment} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Leave a Comment</h3>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Your thoughts</label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
            placeholder="Share your thoughts on this article..."
          />
        </div>
        
        <button
          type="submit"
          disabled={commentMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {commentMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  </section>
);

const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <MainLoader />
  </div>
);
