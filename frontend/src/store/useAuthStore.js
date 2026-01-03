checkAuth: async () => {
  try {
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
    localStorage.removeItem('token'); // Clear invalid token
  } finally {
    set({ isCheckingAuth: false });
  }
},
