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
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editor</p>
              <h2 className="text-lg font-semibold">Compose article</h2>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="gap-2" type="submit" form="new-blog-form" disabled={newBlogMutation.isPending}>
                {newBlogMutation.isPending ? "Creating..." : "Create post"}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="new-blog-form" onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="space-y-4">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a StoryBook CMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Keep it concise and keyword rich.</p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on cards"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                />
              </div>

                <div className="space-y-2">
                <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                <Input
                  id="featuredImageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                />
              </div>

              {/* Content — Summernote */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <SummernoteEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                />
              </div>

            </div>
          </form>
        </div>

        {newBlogMutation.isPending && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewBlog;
