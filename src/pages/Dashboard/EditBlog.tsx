import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { type BlogData } from "../../types/blogTypes";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Save, ArrowLeft, Eye, RefreshCw, Image } from "lucide-react";

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fetch existing blog data
  const { data: blog, isLoading, isError } = useQuery<BlogData>({
    queryKey: ["get-blog", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog ID is required");
      const response = await api.get(`/blogs/${id}`);
      // Handle different response structures
      const blogData = response.data.blogs || response.data.blog || response.data.data || response.data;
      return blogData;
    },
    enabled: !!id,
  });

  // Populate form with existing data
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSynopsis(blog.synopsis || "");
      setFeaturedImageUrl(blog.featuredImageUrl || "");
      
      // Delay setting content to ensure Summernote is initialized
      setTimeout(() => {
        setContent(blog.content || "");
      }, 100);
    }
  }, [blog]);

  const updateBlogMutation = useMutation<any, any, Partial<BlogData>>({
    mutationKey: ["update-blog", id],
    mutationFn: async (payload: Partial<BlogData>) => {
      if (!id) throw new Error("Blog ID is required");
      console.log("Updating blog:", payload);
      const res = await api.patch(`/blogs/${id}`, payload);
      console.log("Blog update response:", res.data);
      return res.data;
    },
    onSuccess: () => {
      toastUtils.blog.updateSuccess("Blog updated successfully!");
      navigate(`/dashboard/blogs/drafts`);
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.blog.operationFailed("Updating blog", derivedMessage, () => console.log("Retry blog update"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !synopsis || !content) {
      toastUtils.auth.validationError("Please fill in all required fields");
      return;
    }

    const payload: Partial<BlogData> = {
      title,
      synopsis,
      content,
    };

    // Only include featuredImageUrl if it's not empty
    if (featuredImageUrl.trim()) {
      payload.featuredImageUrl = featuredImageUrl.trim();
    }

    updateBlogMutation.mutate(payload);
  };

  const handleSaveDraft = async () => {
    if (!title || !synopsis || !content) {
      toastUtils.auth.validationError("Please fill in all required fields");
      return;
    }

    const payload: Partial<BlogData> = {
      title,
      synopsis,
      content,
      isPublished: false,
    };

    // Only include featuredImageUrl if it's not empty
    if (featuredImageUrl.trim()) {
      payload.featuredImageUrl = featuredImageUrl.trim();
    }

    updateBlogMutation.mutate(payload);
  };

  // Show loading state while fetching blog
  if (isLoading) {
    return (
      <DashboardLayout title="Loading Blog" subtitle="Fetching your blog...">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-gray-600">Loading blog details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if blog not found
  if (isError || !blog) {
    return (
      <DashboardLayout title="Blog Not Found" subtitle="The blog you're looking for doesn't exist">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Blog Not Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The blog you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <Button 
            onClick={() => navigate("/dashboard/blogs/draft")} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Blog" subtitle="Modify and update your existing blog">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        {/* Main Editor */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Editor</p>
                <h2 className="text-lg font-bold text-gray-900">Edit your blog</h2>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/dashboard/blogs/drafts")}
                className="border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                variant="outline"
                size="sm" 
                onClick={handleSaveDraft}
                disabled={updateBlogMutation.isPending}
                className="border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                {updateBlogMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </span>
                )}
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                type="submit" 
                form="edit-blog-form" 
                disabled={updateBlogMutation.isPending}
              >
                {updateBlogMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Update & Publish
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="edit-blog-form" onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
            <div className="space-y-6">
              
              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a React Blog Platform"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-lg"
                />
                <p className="text-xs text-gray-600">Keep it concise and keyword rich for better discoverability.</p>
              </div>

              {/* Synopsis */}
              <div className="space-y-3">
                <Label htmlFor="synopsis" className="text-xs font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  Synopsis
                </Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on blog cards (max 200 characters)"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  {synopsis.length}/200 characters - This appears in blog previews
                </p>
              </div>

              {/* Featured Image */}
              <div className="space-y-3">
                <Label htmlFor="featuredImageUrl" className="text-xs font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-2">
                  <Image className="w-4 h-4 text-blue-500" />
                  Featured Image URL
                </Label>
                <Input
                  id="featuredImageUrl"
                  type="url"
                  placeholder="https://example.com/blog-image.jpg"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {featuredImageUrl && (
                  <div className="mt-2">
                    <img 
                      src={featuredImageUrl} 
                      alt="Featured image preview" 
                      className="w-full h-48 object-cover rounded-lg border border-blue-200"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-600">Optional: Add a featured image for your blog post</p>
              </div>

              {/* Content — Summernote */}
              <div className="space-y-3">
                <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Content
                </Label>
                <div className={`border ${isFullscreen ? 'border-transparent' : 'border-blue-200'} ${isFullscreen ? 'rounded-none' : 'rounded-lg'} overflow-hidden transition-all duration-200`}>
                  <SummernoteEditor
                    key={blog?.id || 'editor'}
                    value={content}
                    onChange={(val) => setContent(val)}
                    onFullscreen={(fullscreen) => setIsFullscreen(fullscreen)}
                    height={400}
                    onInit={() => {
                      // Ensure content is set after initialization
                      if (blog?.content && content !== blog.content) {
                        setContent(blog.content);
                      }
                    }}
                  />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Blog Info */}
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Blog Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">
                  {blog?.dateCreated ? new Date(blog.dateCreated).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">
                  {blog?.lastUpdated ? new Date(blog.lastUpdated).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  blog?.isPublished 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {blog?.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Tips */}
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Editing Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Save frequently to avoid losing your changes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use the fullscreen mode for better focus</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Keep your synopsis under 200 characters</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Add a featured image to make your blog stand out</span>
              </li>
            </ul>
          </div>

          {/* Statistics */}
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Blog Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Word Count</span>
                <span className="text-gray-900 font-medium">
                  {content.split(/\s+/).filter(word => word.length > 0).length} words
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Character Count</span>
                <span className="text-gray-900 font-medium">
                  {content.length} characters
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reading Time</span>
                <span className="text-gray-900 font-medium">
                  ~{Math.max(1, Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200))} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {updateBlogMutation.isPending && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <MainLoader />
              <p className="mt-4 text-gray-600">Updating your blog...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditBlog;
