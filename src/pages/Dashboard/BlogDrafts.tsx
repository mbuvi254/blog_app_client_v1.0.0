import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import { toastUtils } from "../../lib/toast";

import { Edit } from "lucide-react";

const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
  Draft: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
};

const BlogDrafts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const { data: blogs, isLoading: blogsLoading, isError, error } = useQuery({
    queryKey: ["get-drafts"],
    queryFn: async () => {
      const response = await api.get("/blogs/draft");
      return response.data.blogs;
    }
  });

   const handlePublish = async (draftId: string) => {
    try {
      setPublishingId(draftId);
      const res = await api.patch(`/blogs/publish/${draftId}`);
      if (res.status === 200) {
        toastUtils.blog.deleteSuccess("Blog published successfully!");
        queryClient.invalidateQueries({ queryKey: ["get-drafts"] });
        return navigate("/dashboard/blogs/published");
      }
    } catch (err: any) {
      console.error("Error publishing blog:", err);
      toastUtils.blog.operationFailed("Publishing blog", err?.response?.data?.message || "Failed to publish blog", () => handlePublish(draftId));
    } finally {
      setPublishingId(null);
    }
  };

  const handleEdit = (blogId: string) => {
    navigate(`/dashboard/blogs/edit/${blogId}`);
  };

  if (blogsLoading) return <MainLoader />;
  if (isError) return <h1>{error.message}</h1>;


  return (
    <DashboardLayout title="Blog Drafts">
      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Latest updates
            </p>
          </div>
        </div>

        <Table>
          <TableCaption>Author blogs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!blogs || blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {blogsLoading ? "Loading blogs..." : "No blogs found."}
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog: BlogData) => (
                <TableRow key={blog.id}>
                  <TableCell className="pl-6">
                    <p className="font-semibold">{blog.title}</p>
                    <p className="text-xs text-muted-foreground">Updated recently</p>
                  </TableCell>

                  <TableCell>
                    <span className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      statusStyles[blog.isPublished ? "Published" : "Draft"]
                    }>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>

                  <TableCell>{blog.author.firstName}</TableCell>
                  <TableCell>{blog.createdAt}</TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(blog.id)}
                        disabled={publishingId === blog.id}
                      >
                        {publishingId === blog.id ? "Publishing..." : "Publish"}
                      </Button>
                      <Button 
                        size="icon-sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(blog.id)} 
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default BlogDrafts;
