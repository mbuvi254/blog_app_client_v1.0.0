import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";

interface BlogResponse {
  status: string;
  message: string;
  blogs: BlogData;
}

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  //const [editorLoaded, setEditorLoaded] = useState(false);


  const navigate = useNavigate();
  const { id: blogId } = useParams();

  // Fetch blog data
  const blogData = useQuery({
    queryKey: ["get-blog-edit", blogId],
    queryFn: async () => {
      const response = await api.get<BlogResponse>(`/blogs/${blogId}`);
      return response?.data?.blogs ?? null;
    },
    enabled: !!blogId,
  });

  // Populate state once data is loaded
  useEffect(() => {
    if (blogData.isSuccess && blogData.data) {
      setTitle(blogData.data.title || "");
      setSynopsis(blogData.data.synopsis || "");
      setContent(blogData.data.content || "");
      setFeaturedImageUrl(blogData.data.featuredImageUrl || "");
      if(blogData?.data.content){
        setContent(blogData.data.content)
        console.log(blogData.data.content)

      }
    }
  }, [blogData.isSuccess, blogData.data]);

  // Edit blog mutation
  const editBlogMutation = useMutation<any, any, Partial<BlogData>>({
    mutationKey: ["edit-blog-draft", blogId],
    mutationFn: async (payload: Partial<BlogData>) => {
      const res = await api.patch(`/blogs/${blogId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toastUtils.blog.updateSuccess("Blog post updated successfully!");
      navigate("/dashboard/blogs/drafts");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.blog.operationFailed(
        "Editing blog",
        derivedMessage,
        () => console.log("Retry blog edit")
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!title.trim() || !synopsis.trim() || !content.trim()) {
      toastUtils.auth.validationError(
        "Please fill in all required fields"
      );
      return;
    }

    editBlogMutation.mutate({
      title: title.trim(),
      synopsis: synopsis.trim(),
      content: content.trim(),
      featuredImageUrl: featuredImageUrl.trim(),
    });
  };

  if (blogData.isLoading) {
    return (
      <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
        <MainLoader />
      </DashboardLayout>
    );
  }

  if (blogData.isError) {
    return (
      <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-destructive">
            Error loading blog
          </h3>
          <p className="text-muted-foreground mt-2">
            {blogData.error?.message || "Failed to load blog data"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => blogData.refetch()}
          >
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!blogData.data) {
    return (
      <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">Blog not found</h3>
          <p className="text-muted-foreground mt-2">
            The blog you're trying to edit doesn't exist.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/dashboard/blogs/drafts")}
          >
            Go Back to Drafts
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Add a debug log to see what's happening
const handleContentChange = (val: string) => {
  console.log("SummernoteEditor onChange called:", val);
  setContent(val);
};


  return (
    <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Editor
              </p>
              <h2 className="text-lg font-semibold">Compose article</h2>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/dashboard/blogs/drafts")}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="gap-2"
                type="submit"
                form="edit-blog-form"
                disabled={editBlogMutation.isPending}
              >
                {editBlogMutation.isPending ? "Updating..." : "Update post"}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form
            id="edit-blog-form"
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-6"
          >
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a StoryBook CMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Keep it concise and keyword rich.
                </p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis *</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on cards"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  required
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                <Input
                  id="featuredImageUrl"
                  placeholder="https://url/image.jpg"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                />
                {featuredImageUrl && (
                  <div className="mt-2">
                    <img 
                      src={featuredImageUrl} 
                      alt="Preview" 
                      className="h-40 w-40 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                  {content && (
                <>
                   <SummernoteEditor
                  value={content}
                  onChange={(val: string) => setContent (val)}
                  
                 
                /> 
           
                </>
              )}
             <textarea value={content} onChange={(e) => setContent(e.target.value)} />


              </div>
            </div>
          </form>
        </div>

        {/* Loader overlay */}
        {editBlogMutation.isPending && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditBlog;