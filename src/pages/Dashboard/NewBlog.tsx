import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { type BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import { FileText, Image, Loader2, Send } from "lucide-react";

const NewBlog = () => {
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");

  const navigate = useNavigate();

  const newBlogMutation = useMutation<any, any, Partial<BlogData>>({
    mutationKey: ["new-blog-key"],
    mutationFn: async (payload: Partial<BlogData>) => {
      console.log("Creating new blog:", payload);
      const res = await api.post("/blogs", payload);
      console.log("Blog creation response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      setTitle("");
      setSynopsis("");
      setContent("");
      setFeaturedImageUrl("");
      toastUtils.blog.createSuccess("Blog post created!");
      navigate("/dashboard/blogs/drafts");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.blog.operationFailed("Creating blog", derivedMessage, () => console.log("Retry blog creation"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !synopsis || !content) {
      toastUtils.auth.validationError("Please fill in all required fields");
      return;
    }

    newBlogMutation.mutate({
      title,
      synopsis,
      content,
      featuredImageUrl,
      isPublished: false,
      isDeleted: false,
    });
  };

  return (
    <DashboardLayout title="New Blog" subtitle="Create a new blog post">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-white border border-blue-100 rounded-xl shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Editor</p>
              <h2 className="text-lg font-bold text-gray-900">Compose article</h2>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                type="submit" 
                form="new-blog-form" 
                disabled={newBlogMutation.isPending}
              >
                {newBlogMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create post
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="new-blog-form" onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="space-y-4">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-blue-600">Title</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="title"
                    placeholder="e.g. Building a StoryBook CMS"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-600">Keep it concise and keyword rich.</p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis" className="text-xs font-semibold uppercase tracking-wide text-blue-600">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on cards"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

                <div className="space-y-2">
                <Label htmlFor="featuredImageUrl" className="text-xs font-semibold uppercase tracking-wide text-blue-600">Featured Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="featuredImageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Content — Summernote */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wide text-blue-600">Content</Label>
                <SummernoteEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                />
              </div>

            </div>
          </form>
        </div>

        {newBlogMutation.isPending && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewBlog;
