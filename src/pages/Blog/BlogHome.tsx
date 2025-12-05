import BlogLayout from "./BlogLayout";
import Blogs from "./Blogs";

const BlogHome = () => {
  return (
    <BlogLayout title="Blog Home" subtitle="Latest product, design, and growth stories">
      <Blogs />
    </BlogLayout>
  );
};

export default BlogHome;