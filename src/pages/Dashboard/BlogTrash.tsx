import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import TableLoading from "../../components/ui/TableLoading";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toastUtils } from "../../lib/toast";

interface Blog {
  id: number;
  title: string;
  deletedAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const BlogTrash = () => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: trashedBlogs = [], isLoading, isError, error } = useQuery<Blog[]>({
    queryKey: ["trashed-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs/trash");
      return response.data.blogs;
    },
  });

  const handleRestore = async (blogId: number) => {
    try {
      setIsProcessing(blogId);
      setIsRestoring(true);
      await api.patch(`/blogs/restore/${blogId}`);
      toastUtils.blog.updateSuccess("Blog restored successfully");
      await queryClient.invalidateQueries({ queryKey: ["trashed-blogs"] });
    } catch (error) {
      console.error("Error restoring blog:", error);
      toastUtils.blog.operationFailed("Restoring blog", "Failed to restore blog. Please try again.");
    } finally {
      setIsProcessing(null);
      setIsRestoring(false);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      setIsProcessing(blogId);
      setIsDeleting(true);
      await api.delete(`/blogs/${blogId}`);
      toastUtils.blog.deleteSuccess("Blog permanently deleted");
      await queryClient.invalidateQueries({ queryKey: ["trashed-blogs"] });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toastUtils.blog.operationFailed("Deleting blog", "Failed to delete blog. Please try again.");
    } finally {
      setIsProcessing(null);
      setIsDeleting(false);
    }
  };


  if (isLoading) {
    return (
      <DashboardLayout title="Trash" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <MainLoader />
        </div>
      </DashboardLayout>
    );
  }

  // Show loading skeleton during operations
  if (isRestoring || isDeleting) {
    return (
      <DashboardLayout title="Trash" subtitle="Processing...">
        <TableLoading message={isRestoring ? "Restoring blog..." : "Deleting blog..."} rows={trashedBlogs?.length || 3} />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Error" subtitle="Failed to load trashed blogs">
        <div className="text-center py-12">
          <p className="text-destructive">Error: {error?.message || "Failed to load trashed blogs"}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.refetchQueries({ queryKey: ["trashed-blogs"] })}
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Trash"
      subtitle="Deleted blogs remain here temporarily. Restore or permanently delete them."
    >
      <div className="rounded-xl border border-blue-100 bg-white shadow-sm">
        <Table>
          <TableCaption>Restore items before permanent deletion</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Title</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trashedBlogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-600">
                  No deleted blogs found
                </TableCell>
              </TableRow>
            ) : (
              trashedBlogs.map((blog) => {
                const isProcessingBlog = isProcessing === blog.id;
                return (
                  <TableRow key={blog.id}>
                    <TableCell className="pl-6 font-medium text-gray-900">{blog.title}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(blog.deletedAt)}</TableCell>
                    <TableCell className="text-gray-700">
                      {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(blog.id)}
                          disabled={isProcessingBlog}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed gap-1.5"
                        >
                          {isProcessingBlog ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(blog.id)}
                          disabled={isProcessingBlog}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed gap-1.5"
                        >
                          {isProcessingBlog ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default BlogTrash;