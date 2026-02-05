"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";
import { MessageThread, SendMessagePayload, Message } from "@/types/message";
import { useAuth } from "@/context/AuthContext";

interface StartConversationPayload {
  recipientId: string;
  propertyId?: string;
  message?: string;
}

export const useMessages = (conversationId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        const socket = initSocket(token);
        
        socket.on("connect", () => {
          setIsSocketConnected(true);
        });

        socket.on("disconnect", () => {
          setIsSocketConnected(false);
        });

        // Listen for incoming messages
        socket.on("receive_message", (data: { conversationId: string; message: Message }) => {
          queryClient.setQueryData<MessageThread>(
            ["conversation", data.conversationId],
            (old) => {
              if (old) {
                return {
                  ...old,
                  messages: [...old.messages, data.message],
                  lastMessageAt: data.message.timestamp,
                };
              }
              return old;
            }
          );

          // Update threads list
          queryClient.invalidateQueries({ queryKey: ["message-threads"] });
        });

        // Listen for errors
        socket.on("error", (error: { message: string }) => {
          console.error("Socket error:", error.message);
        });
      }
    }

    return () => {
      disconnectSocket();
    };
  }, [user, queryClient]);

  // Join conversation room
  useEffect(() => {
    if (conversationId && isSocketConnected) {
      const socket = getSocket();
      if (socket) {
        socket.emit("join_conversation", conversationId);
      }
    }
  }, [conversationId, isSocketConnected]);

  // Fetch all message threads
  const {
    data: threads,
    isLoading: threadsLoading,
    error: threadsError,
  } = useQuery<MessageThread[]>({
    queryKey: ["message-threads"],
    queryFn: async () => {
      const { data } = await api.get("/messages/threads");
      return data;
    },
    enabled: !!user,
  });

  // Fetch specific conversation
  const {
    data: conversation,
    isLoading: conversationLoading,
    error: conversationError,
  } = useQuery<MessageThread>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const { data } = await api.get(`/messages/${conversationId}`);
      return data;
    },
    enabled: !!conversationId && !!user,
  });

  // Start a new conversation
  const startConversation = useMutation({
    mutationFn: async (payload: StartConversationPayload) => {
      const { data } = await api.post<MessageThread>("/messages/start", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["message-threads"] });
      queryClient.setQueryData(["conversation", data.conversationId], data);
    },
  });

  // Send message via Socket.io
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("send_message", payload);
    } else {
      console.error("Socket not connected");
    }
  }, []);

  // Mark messages as read
  const markAsRead = useMutation({
    mutationFn: async (conversationId: string) => {
      const { data } = await api.put(`/messages/${conversationId}/read`);
      return data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["message-threads"] });
    },
  });

  return {
    threads,
    threadsLoading,
    threadsError,
    conversation,
    conversationLoading,
    conversationError,
    sendMessage,
    markAsRead: markAsRead.mutate,
    startConversation: startConversation.mutateAsync,
    isStartingConversation: startConversation.isPending,
    isSocketConnected,
  };
};
