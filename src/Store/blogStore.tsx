import { type StateCreator, create } from 'zustand'

interface BlogFormData {
    id: string;
    title: string;
    synopsis: string;
    content: string;
    featuredImageUrl: string;
    isPublished: boolean;
}

interface BlogStoreType {
    // Form state for editing
    blogForm: BlogFormData;
    
    // Current blog ID
    currentBlogId: string;
    
    // Actions
    setBlogForm: (form: BlogFormData) => void;
    updateBlogForm: (updates: Partial<BlogFormData>) => void;
    setCurrentBlogId: (id: string) => void;
    resetBlogForm: () => void;
}

const initialBlogForm: BlogFormData = {
    id: "",
    title: "",
    synopsis: "",
    content: "",
    featuredImageUrl: "",
    isPublished: false,
};

const blogStore: StateCreator<BlogStoreType> = (set) => ({
    blogForm: initialBlogForm,
    currentBlogId: "",
    
    setBlogForm: (blogForm) => set({ blogForm }),
    
    updateBlogForm: (updates) => set((state) => ({
        blogForm: { ...state.blogForm, ...updates }
    })),
    
    setCurrentBlogId: (currentBlogId) => set({ currentBlogId }),
    
    resetBlogForm: () => set({ 
        blogForm: initialBlogForm,
        currentBlogId: "" 
    }),
});

const useBlogStore = create(blogStore);
export default useBlogStore;