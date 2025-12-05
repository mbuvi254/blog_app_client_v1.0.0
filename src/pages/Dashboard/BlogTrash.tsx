import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
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
      await api.patch(`/blogs/restore/${blogId}`);
      await queryClient.invalidateQueries({ queryKey: ["trashed-blogs"] });
      toastUtils.success("Blog restored successfully");
    } catch (error) {
      console.error("Error restoring blog:", error);
      toastUtils.error("Failed to restore blog. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      setIsProcessing(blogId);
      await api.delete(`/blogs/${blogId}`);
      await queryClient.invalidateQueries({ queryKey: ["trashed-blogs"] });
      toastUtils.success("Blog permanently deleted");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toastUtils.error("Failed to delete blog. Please try again.");
    } finally {
      setIsProcessing(null);
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
      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
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
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No deleted blogs found
                </TableCell>
              </TableRow>
            ) : (
              trashedBlogs.map((blog) => {
                const isProcessingBlog = isProcessing === blog.id;
                return (
                  <TableRow key={blog.id}>
                    <TableCell className="pl-6 font-medium">{blog.title}</TableCell>
                    <TableCell>{formatDate(blog.deletedAt)}</TableCell>
                    <TableCell>
                      {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(blog.id)}
                          // disabled={!!isProcessing && !isProcessingBlog}
                          disabled={isProcessingBlog}

                          className="gap-1.5"
                        >
                          {isProcessingBlog ? (
                            <MainLoader />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(blog.id)}
                          // disabled={!!isProcessing && !isProcessingBlog}
                          disabled={isProcessingBlog}
                          className="gap-1.5"
                        >
                          {isProcessingBlog ? (
                            <MainLoader  />
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