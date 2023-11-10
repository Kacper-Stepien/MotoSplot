const API_URL = import.meta.env.VITE_API_URL as string;

import { createErrorResponse, createSuccessResponse } from "./utils";

const createPost = async (content: string, files: File[]) => {
  const formData = new FormData();
  formData.append("content", content);
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await fetch(`${API_URL}/user/posts`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return {
      status: "ok",
      message: "Dodano post.",
      post: data,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};

const getPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/user/posts/friends`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return {
      status: "ok",
      message: "Pobrano posty.",
      posts: data,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};

const getUserPosts = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/user/posts/user?userId=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return {
      status: "ok",
      message: "Pobrano posty.",
      posts: data,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};

const deletePost = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/user/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      return createSuccessResponse("Usunięto post.");
    }
    const data = await response.json();
    throw new Error(data.message);
  } catch (error) {
    return createErrorResponse(error);
  }
};

const editPost = async (id: number, content: string) => {
  try {
    const response = await fetch(`${API_URL}/user/posts/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    if (response.ok) {
      return createSuccessResponse("Edytowano post.");
    }
    const data = await response.json();
    throw new Error(data.message);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export { createPost, getPosts, getUserPosts, deletePost, editPost };
