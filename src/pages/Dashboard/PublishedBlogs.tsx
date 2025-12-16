import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import TableLoading from "../../components/ui/TableLoading";
import api from "../../lib/api";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import { toastUtils } from "../../lib/toast";
import { Loader2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-800 border border-green-200",
  Draft: "bg-amber-100 text-amber-800 border border-amber-200"
};

const PublishedBlogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const { data: blogs, isLoading: blogsLoading, isError, error } = useQuery({
    queryKey: ["get-published-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs/published");
      return response.data.blogs;
    }
  });

   const handlePublish = async (draftId: string) => {
    try {
      setPublishingId(draftId);
      setIsUnpublishing(true);
      const res = await api.patch(`/blogs/unpublish/${draftId}`);
      if (res.status === 200) {
        toastUtils.blog.unpublishSuccess();
        // Invalidate and refetch to update table
        await queryClient.invalidateQueries({ queryKey: ["get-published-blogs"] });
        // Navigate after successful update
        return navigate("/dashboard/blogs/drafts");
      }
    } catch (err: any) {
      console.error("Error unpublishing blog:", err);
      toastUtils.blog.operationFailed("Unpublishing blog", err?.response?.data?.message || "Failed to unpublish blog", () => handlePublish(draftId));
    } finally {
      setPublishingId(null);
      setIsUnpublishing(false);
    }
  };

  if (blogsLoading) return <MainLoader />;
  if (isError) return <h1>{error.message}</h1>;
  
  // Show loading skeleton during unpublish operations
  if (isUnpublishing) {
    return (
      <DashboardLayout title="Published Blogs">
        <TableLoading message="Unpublishing blog..." rows={blogs?.length || 3} />
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout title="Published Blogs">
      <div className="rounded-xl border border-blue-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
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
                    <p className="font-semibold text-gray-900">{blog.title}</p>
                    <p className="text-xs text-gray-600">Updated recently</p>
                  </TableCell>

                  <TableCell>
                    <span className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      statusStyles[blog.isPublished ? "Published" : "Draft"]
                    }>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>

                  <TableCell className="text-gray-700">{blog.author.firstName}</TableCell>
                  <TableCell className="text-gray-600">{blog.createdAt}</TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(blog.id)}
                        disabled={publishingId === blog.id || isUnpublishing}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {publishingId === blog.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Un Publishing...
                          </>
                        ) : (
                          "UnPublish"
                        )}
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

export default PublishedBlogs;
