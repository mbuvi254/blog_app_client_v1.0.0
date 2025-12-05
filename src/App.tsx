
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import AuthorRegister from './pages/Dashboard/AuthorRegister'
import AuthorLogin from './pages/Dashboard/AuthorLogin'
import { Toaster } from './components/ui/sonner'
import PublishedBlogs from './pages/Dashboard/PublishedBlogs'
import BlogDrafts from './pages/Dashboard/BlogDrafts'
import BlogTrash from './pages/Dashboard/BlogTrash'
import NewBlog from './pages/Dashboard/NewBlog'
import EditBlog from './pages/Dashboard/EditBlog'
import Blogs from './pages/Blog/Blogs'
import ReadBlog from './pages/Blog/ReadBlog'
import BlogHome from './pages/Blog/BlogHome'
import BlogLayout from './pages/Blog/BlogLayout'
import BlogsTable from './pages/Dashboard/BlogsTable'
import AuthorProfile from './pages/Dashboard/AuthorProfile'
import UpdateProfile from './pages/Dashboard/UpdateProfile'
import UpdatePassword from './pages/Dashboard/UpdatePassword'
function App() {


  return (
    <>
     <Routes>
       

       {/* dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/blogs/published" element={<PublishedBlogs />} />
        <Route path="/dashboard/blogs/drafts" element={<BlogDrafts />} />
        <Route path="/dashboard/blogs/trash" element={<BlogTrash />} />

        <Route path="/dashboard/blogs" element={<BlogsTable />} />
        <Route path="/dashboard/blogs/new" element={<NewBlog />} />
        <Route path="/dashboard/blogs/edit/:id" element={<EditBlog />} />

     {/* auth routes */}
    <Route path="/dashboard/register" element={<AuthorRegister />} />
    <Route path="/dashboard/login" element={<AuthorLogin />} />
    <Route path="/dashboard/profile" element={<AuthorProfile />} />
      <Route path="/dashboard/profile/update" element={<UpdateProfile />} />
      <Route path="/dashboard/profile/update/password" element={<UpdatePassword />} />


    {/* blog routes */}
      <Route path="/" element={<BlogHome />} />
    <Route path="/blogs" element={<BlogLayout title="All Blogs"><Blogs /></BlogLayout>} />
    <Route path="/blogs/:id" element={<ReadBlog />} />



      </Routes>
      <Toaster />
    </>
  )
}

export default App
