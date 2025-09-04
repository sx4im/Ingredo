import { toast } from "@/hooks/use-toast";

class APIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    
    // Handle 401 globally - redirect to login
    if (response.status === 401) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      // In a real app, you might redirect to login page
      window.location.href = "/login";
      return;
    }
    
    throw new APIError(text || response.statusText, response.status);
  }
  
  return response;
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    await handleResponse(response);
    return response.json();
  },

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    
    await handleResponse(response);
    return response.json();
  },

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    
    await handleResponse(response);
    return response.json();
  },

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    
    await handleResponse(response);
    return response.json();
  },

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    await handleResponse(response);
    return response.json();
  },
};

export { APIError };
