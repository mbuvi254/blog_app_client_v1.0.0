import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import DashboardLayout from "./Dashlayout";
import { Button } from "../../components/ui/button";
import { Edit,Trash } from "lucide-react";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogData } from "../../types/blogTypes";
import { useNavigate } from "react-router-dom";

const statusStyles: Record<string, string> = {
  Published: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
  Draft: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
};

const BlogsTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const trashMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const response = await api.patch("/blogs/trash/" + blogId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-blogs"] });
    }
  });

  const { data: blogs, isLoading: blogsLoading, isError, error } = useQuery({
    queryKey: ["get-user-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs");
      return response.data.blogs;
    }
  });

  const handleTrash = async (blogId: string) => {
    setIsLoading(true);
    try {
      await trashMutation.mutateAsync(blogId);
      navigate("/dashboard/blogs/trash/" + blogId);
    } catch (err) {
      console.error("Error trashing blog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (blogId: string) => {
    setIsLoading(true);
    console.log("Editing blog " + blogId);
    setEditingBlogId(blogId);
    setIsLoading(false);
    navigate("/dashboard/blogs/edit/" + blogId);
  };

  if (blogsLoading) return <MainLoader />;
  if (isError) return <h1>{error.message}</h1>;
  // if (blogs.length === 0) return <p>No blogs yet.</p>;

  return (
    <DashboardLayout title="Blogs">
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

                  <TableCell>{blog.author.firstName} {blog.author.lastName}</TableCell>
                  <TableCell>{blog.createdAt}</TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit blog"
                      onClick={() => handleEdit(blog.id)}
                      disabled={editingBlogId === blog.id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Trash blog"
                      onClick={() => handleTrash(blog.id)}
                      disabled={editingBlogId === blog.id}
                    >
                      <Trash className="h-4 w-4" />
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

export default BlogsTable;
