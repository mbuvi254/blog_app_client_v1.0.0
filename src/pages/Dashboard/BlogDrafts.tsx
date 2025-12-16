import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import TableLoading from "../../components/ui/TableLoading";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";
import { toastUtils } from "../../lib/toast";
import useBlogStore from "../../Store/blogStore";
import { Edit, Trash2, Loader2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-800 border border-green-200",
  Draft: "bg-amber-100 text-amber-800 border border-amber-200"
};

const BlogDrafts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTrashing, setIsTrashing] = useState<string | null>(null);

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
      setIsPublishing(true);
      const res = await api.patch(`/blogs/publish/${draftId}`);
      if (res.status === 200) {
        toastUtils.blog.publishSuccess();
        // Invalidate and refetch to update table
        await queryClient.invalidateQueries({ queryKey: ["get-drafts"] });
        // Navigate after successful update
        return navigate("/dashboard/blogs/published");
      }
    } catch (err: any) {
      console.error("Error publishing blog:", err);
      toastUtils.blog.operationFailed("Publishing blog", err?.response?.data?.message || "Failed to publish blog", () => handlePublish(draftId));
    } finally {
      setPublishingId(null);
      setIsPublishing(false);
    }
  };

  // Helper function to get the correct blog ID
  const getBlogId = (blogData: BlogData): string => {
    // Use whatever property contains the ID
    return blogData.id || blogData.id || "";
  };

const handleEdit = (blogData: BlogData) => {
  try {
    // Get the correct ID using helper function
    const blogId = getBlogId(blogData);
    
    if (!blogId) {
      console.error("No valid blog ID found:", blogData);
      toastUtils.blog.operationFailed("Edit blog", "Invalid blog ID. Cannot edit this draft.");
      return;
    }
    
    console.log("Editing blog with ID:", blogId);
    console.log("Blog data to store:", {
      id: blogId,
      title: blogData.title,
      synopsis: blogData.synopsis || "",
      content: blogData.content || "",
      featuredImageUrl: blogData.featuredImageUrl || "",
      isPublished: blogData.isPublished || false,
      contentLength: blogData.content?.length || 0
    });
    
    // Store the blog ID in Zustand
    useBlogStore.getState().setCurrentBlogId(blogId);
    
    // Pre-fill the form with blog data - use setBlogForm to completely replace
    useBlogStore.getState().setBlogForm({
      id: blogId,
      title: blogData.title || "",
      synopsis: blogData.synopsis || "",
      content: blogData.content || "",
      featuredImageUrl: blogData.featuredImageUrl || "",
      isPublished: blogData.isPublished || false,
    });
    
    // Log the current state after update
    console.log("Zustand store after update:", useBlogStore.getState().blogForm);
    
    // Navigate to edit page
    navigate(`/dashboard/blogs/edit/${blogId}`);
  } catch (err) {
    console.error("Failed to edit blog:", err);
    toastUtils.blog.operationFailed("Edit blog", "Failed to open blog for editing. Please try again.");
  }
};

  const handleTrash = async (blogId: string) => {
    try {
      setIsLoading(true);
      setIsTrashing(blogId);
      await api.patch(`/blogs/trash/${blogId}`);
      toastUtils.blog.deleteSuccess("Blog moved to trash");

      // Invalidate and refetch to update table
      await queryClient.invalidateQueries({ queryKey: ["get-drafts"] });
    } catch (err: any) {
      console.error("Error trashing blog:", err);
      toastUtils.blog.operationFailed(
        "Trashing blog",
        err?.response?.data?.message || "Failed to trash blog"
      );
    } finally {
      setIsLoading(false);
      setIsTrashing(null);
    }
  };

  if (blogsLoading) return <MainLoader />;
  if (isError) return <h1>Error: {error.message}</h1>;
  
  // Show loading skeleton during operations
  if (isPublishing || isTrashing) {
    return (
      <DashboardLayout title="Blog Drafts">
        <TableLoading message={isPublishing ? "Publishing blog..." : "Moving to trash..."} rows={blogs?.length || 3} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Blog Drafts">
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
                  {blogsLoading ? "Loading blogs..." : "No drafts found."}
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

                  <TableCell className="text-gray-700">{blog.author?.firstName || "Unknown"}</TableCell>
                  <TableCell className="text-gray-600">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(getBlogId(blog))}
                        disabled={publishingId === blog.id || isPublishing}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {publishingId === blog.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Publishing...
                          </>
                        ) : (
                          "Publish"
                        )}
                      </Button>
                      <Button 
                        size="icon-sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(blog)} 
                        disabled={isLoading || isPublishing || !!isTrashing}
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon-sm" 
                        variant="ghost" 
                        onClick={() => handleTrash(getBlogId(blog))} 
                        disabled={isLoading || isTrashing === getBlogId(blog) || isPublishing}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTrashing === getBlogId(blog) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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