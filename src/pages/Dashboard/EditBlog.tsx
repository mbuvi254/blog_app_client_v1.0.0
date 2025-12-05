import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState, useEffect, useMemo } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import useBlogStore from "../../Store/blogStore";

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
  const [editorKey, setEditorKey] = useState(0);
  const [isUsingStoreData, setIsUsingStoreData] = useState(false);

  const navigate = useNavigate();
  const { id: blogId } = useParams();
  
  // Get Zustand store
  const { blogForm, currentBlogId, resetBlogForm } = useBlogStore();

  // Debug: Log current store state
  console.log(" Current Zustand store:", {
    storeBlogId: blogForm.id,
    currentBlogId,
    storeTitle: blogForm.title,
    storeContentLength: blogForm.content?.length,
    urlBlogId: blogId
  });

  // Check if we have pre-filled data from Zustand
  const hasPrefilledData = useMemo(() => {
    if (!blogId || !blogForm.id) {
      console.log(" No prefilled data: missing blogId or store id");
      return false;
    }
    
    const idsMatch = blogForm.id === blogId;
    const hasContent = blogForm.content && blogForm.content.length > 0;
    
    console.log("🔍 Checking prefilled data:", {
      blogId,
      storeId: blogForm.id,
      idsMatch,
      storeContentLength: blogForm.content?.length,
      hasContent,
      result: idsMatch && hasContent
    });
    
    return idsMatch && hasContent;
  }, [blogId, blogForm.id, blogForm.content]);

  // Fetch blog data only if we don't have it in Zustand
  const blogData = useQuery({
    queryKey: ["get-blog-edit", blogId],
    queryFn: async () => {
      console.log("📡 Fetching blog from API for id:", blogId);
      const response = await api.get<BlogResponse>(`/blogs/${blogId}`);
      const data = response?.data?.blogs ?? null;
      console.log("📦 API response:", {
        hasData: !!data,
        title: data?.title,
        contentLength: data?.content?.length,
        contentPreview: data?.content?.substring(0, 100) + "..."
      });
      return data;
    },
    enabled: !!blogId && !hasPrefilledData, // Only fetch if no pre-filled data
  });

  // Populate state with data - Priority: Zustand store > API data
  useEffect(() => {
    if (!blogId) return;
    
    console.log("EditBlog useEffect triggered", {
      blogId,
      hasPrefilledData,
      apiDataReady: blogData.isSuccess,
      isUsingStoreData
    });

    // Priority 1: Use Zustand store data if available
    if (hasPrefilledData && blogForm.content) {
      console.log("USING ZUSTAND STORE DATA");
      console.log("Store content (first 200 chars):", blogForm.content.substring(0, 200) + "...");
      setIsUsingStoreData(true);
      setTitle(blogForm.title || "");
      setSynopsis(blogForm.synopsis || "");
      setContent(blogForm.content || "");
      setFeaturedImageUrl(blogForm.featuredImageUrl || "");
      setEditorKey(prev => prev + 1);
      return;
    }

    // Priority 2: Use fetched API data
    if (blogData.isSuccess && blogData.data) {
      console.log("USING API FETCHED DATA");
      const blog = blogData.data;
      console.log("API content (first 200 chars):", blog.content?.substring(0, 200) + "...");
      setIsUsingStoreData(false);
      setTitle(blog.title || "");
      setSynopsis(blog.synopsis || "");
      setContent(blog.content || "");
      setFeaturedImageUrl(blog.featuredImageUrl || "");
      setEditorKey(prev => prev + 1);
    }
  }, [blogForm, blogData.isSuccess, blogData.data, hasPrefilledData, blogId]);

  // Edit blog mutation
  const editBlogMutation = useMutation<any, any, Partial<BlogData>>({
    mutationKey: ["edit-blog-draft", blogId],
    mutationFn: async (payload: Partial<BlogData>) => {
      const res = await api.patch(`/blogs/${blogId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toastUtils.blog.updateSuccess("Blog post updated successfully!");
      resetBlogForm(); // Clear Zustand store after successful update
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
        derivedMessage || "Failed to update blog"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!title.trim()) {
      toastUtils.auth.validationError("Title is required");
      return;
    }
    
    if (!content.trim()) {
      toastUtils.auth.validationError("Content is required");
      return;
    }

    const payload: Partial<BlogData> = {
      title: title.trim(),
      synopsis: synopsis.trim(),
      content: content.trim(),
    };

    // Only include featuredImageUrl if it's not empty
    if (featuredImageUrl.trim()) {
      payload.featuredImageUrl = featuredImageUrl.trim();
    }

    console.log("Submitting blog update:", {
      ...payload,
      contentLength: payload.content?.length
    });
    editBlogMutation.mutate(payload);
  };

  const handleContentChange = (val: string) => {
    console.log("Content changed:", val.length, "characters");
    setContent(val);
  };

  // Save as draft handler
  const handleSaveDraft = () => {
    const payload: Partial<BlogData> = {
      title: title.trim() || "Untitled Draft",
      synopsis: synopsis.trim(),
      content: content.trim(),
      isPublished: false,
    };

    if (featuredImageUrl.trim()) {
      payload.featuredImageUrl = featuredImageUrl.trim();
    }

    editBlogMutation.mutate(payload);
  };

  // Handle image URL error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    toastUtils.blog.operationFailed("Image Load", "Failed to load image from URL");
  };

  // Show loading only when we're fetching from API and don't have store data
  if (blogData.isLoading && !hasPrefilledData) {
    return (
      <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
        <div className="flex items-center justify-center min-h-[400px]">
          <MainLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (blogData.isError && !hasPrefilledData) {
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
          <Button 
            variant="ghost" 
            className="mt-4 ml-2"
            onClick={() => navigate("/dashboard/blogs/drafts")}
          >
            Go Back to Drafts
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Editor {isUsingStoreData ? "(From Store)" : "(From API)"}
              </p>
              <h2 className="text-lg font-semibold">Edit article</h2>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/dashboard/blogs/drafts")}
                disabled={editBlogMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={handleSaveDraft}
                disabled={editBlogMutation.isPending || !content}
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                className="gap-2"
                type="submit"
                form="edit-blog-form"
                disabled={editBlogMutation.isPending || !content}
              >
                {editBlogMutation.isPending ? "Updating..." : "Update & Publish"}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form
            id="edit-blog-form"
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-6"
          >
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a StoryBook CMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={editBlogMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Keep it concise and keyword rich.
                </p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on cards"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={3}
                  disabled={editBlogMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: A brief summary of your article.
                </p>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                <div className="flex flex-col gap-4">
                  {featuredImageUrl && (
                    <div className="relative inline-block">
                      <img 
                        src={featuredImageUrl} 
                        alt="Featured image preview" 
                        className="h-48 w-auto max-w-full object-contain rounded-lg border border-border/60 bg-muted/20"
                        onError={handleImageError}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFeaturedImageUrl("")}
                        disabled={editBlogMutation.isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <Input
                    id="featuredImageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    disabled={editBlogMutation.isPending}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional: Enter a URL for the featured image.
                </p>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  {/* Show SummernoteEditor when content is available */}
                  {content !== undefined ? (
                    <SummernoteEditor
                      key={`${editorKey}-${content?.length || 0}`} // Force re-render when content changes
                      value={content}
                      onChange={handleContentChange}
                      disabled={editBlogMutation.isPending}
                      placeholder="Start writing your blog content here..."
                    />
                  ) : (
                    <div className="min-h-[300px] flex items-center justify-center bg-muted/20">
                      <MainLoader size="sm" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Write your article content. HTML formatting is supported.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Characters: {content?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Debug Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data Source:</span>
                <span className={`font-medium px-2 py-1 rounded-full ${
                  isUsingStoreData 
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {isUsingStoreData ? "Zustand Store" : "API"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Content Length:</span>
                <span className="font-medium">
                  {content?.length || 0} chars
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Store ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                  {blogForm.id || "(empty)"}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">URL ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                  {blogId}
                </code>
              </div>
              <div className="pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/dashboard/blogs/drafts")}
                  disabled={editBlogMutation.isPending}
                >
                  Back to Drafts
                </Button>
              </div>
            </div>
          </div>
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