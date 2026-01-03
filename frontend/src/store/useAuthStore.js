checkAuth: async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }
    
    // Make sure token exists before making request
    const token = localStorage.getItem('token');
    if (!token) {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }
    
    const res = await axiosInstance.get("/auth/check");
    set({ authUser: res.data });
    get().connectSocket();
  } catch (error) {
    console.log("Error in authCheck:", error);
    set({ authUser: null });
    
    // Only try to remove token if in browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  } finally {
    set({ isCheckingAuth: false });
  }
},
