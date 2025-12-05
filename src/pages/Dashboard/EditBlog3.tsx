import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import api from "../../lib/api";

interface EditBlogProps {
    blogId: string;
}

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { id:blogId } = useParams();

  const blogData = useQuery({
    queryKey: ["get-blog", blogId],
    queryFn: async () => {
      const response = await api.get(`/blogs/${blogId}`);
      console.log(response.data.blog)
        return response?.data?.blogs ?? null;
      return response.data.blog;
    },
  });

  useEffect(() => {
    if (blogData?.data) {
      setTitle(blogData?.data.title);
      setSynopsis(blogData?.data.synopsis);
      setContent(blogData?.data.content);
    }
  }, [blogData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({ title, synopsis, content });
    setIsLoading(false);
  };

  return (
    <DashboardLayout title="Edit Blog" subtitle="Edit a blog post">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editor</p>
              <h2 className="text-lg font-semibold">Compose article</h2>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm">
                Save draft
              </Button>
              <Button size="sm" className="gap-2" type="submit" form="edit-blog-form" disabled={isLoading}>
                {isLoading ? "Updating..." : "Edit post"}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="edit-blog-form" onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
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

        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditBlog;
