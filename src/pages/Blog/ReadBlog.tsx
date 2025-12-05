import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BlogLayout from "./BlogLayout";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../../Store/userStore";
import toastUtils from "../../lib/toast";

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
      const res = await api.get(`/blogs/comments/${id}`);
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
    className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
  >
    ← Back to blogs
  </button>
);

const BlogContent = ({ blog }: { blog: any }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{blog.author}</span>
      <span aria-hidden="true">•</span>
      <time>{new Date(blog.createdAt).toLocaleString()}</time>
    </div>
    {blog.featuredImageUrl && (
      <img src={blog.featuredImageUrl} alt={blog.title} className="h-[360px] w-full rounded-[28px] object-cover" />
    )}
    <p className="text-lg leading-relaxed text-muted-foreground">{blog.content}</p>
  </div>
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
  <section className="space-y-6 rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
    <header>
      <h2 className="text-xl font-semibold">Comments</h2>
      <p className="text-sm text-muted-foreground">Join the discussion</p>
    </header>

    <div className="space-y-4">
      {commentsLoading && <p className="text-sm text-muted-foreground">Loading comments...</p>}
      {commentsIsError && <p className="text-sm text-red-500">Failed to load comments: {String(commentsFetchError?.message)}</p>}
      {!commentsLoading && comments?.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>}

      {comments?.map((comment: CommentData) => (
        <article key={comment.id} className="rounded-2xl border border-border/40 p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
               {comment.user?.username || comment.user?.firstName || "Unknown"}
            </span>
            <span aria-hidden="true">•</span>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-foreground">{comment.comment}</p>
        </article>
      ))}
    </div>

    <form onSubmit={handleComment} className="space-y-4 rounded-2xl border border-border/50 bg-background/60 p-4">
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comment</label>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
          className="min-h-[120px] rounded-2xl border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          placeholder="Share your thoughts..."
        />
      </div>
      <button
        type="submit"
        disabled={commentMutation.isPending}
        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
      >
        {commentMutation.isPending ? "Posting..." : "Post comment"}
      </button>
    </form>
  </section>
);

const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <MainLoader />
  </div>
);
