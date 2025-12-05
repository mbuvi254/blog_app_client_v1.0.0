export interface BlogResponse {
  status: string;
  message: string;
  blogs: BlogData;
  blog:BlogData;
}



// Blog Data
export type BlogData = {
    id: string;
    title: string;
    synopsis : string;
    content: string;
    author: BlogAuthor;
    featuredImageUrl: string;
    createdAt: string;
    lastUpdated?: string;
    isDeleted: boolean;
    isPublished: boolean;
    featuredImage?: string;
}

// Blog Author
export type BlogAuthor = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string
}
