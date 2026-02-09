"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/context/AuthContext";
import { ChatList } from "@/components/messaging/ChatList";
import { MessageThread } from "@/components/messaging/MessageThread";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";

import { Suspense } from "react";

const MessagesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>();
  const [isInitializing, setIsInitializing] = useState(false);

  const {
    threads,
    threadsLoading,
    conversation,
    conversationLoading,
    sendMessage,
    markAsRead,
    startConversation,
    isStartingConversation,
    isSocketConnected,
  } = useMessages(selectedConversationId);

  // Handle starting a new conversation from URL params
  useEffect(() => {
    const startRecipientId = searchParams.get("start");
    const propertyId = searchParams.get("property");

    if (startRecipientId && user && !isInitializing) {
      setIsInitializing(true);

      const initConversation = async () => {
        try {
          const thread = await startConversation({
            recipientId: startRecipientId,
            propertyId: propertyId || undefined,
          });
          setSelectedConversationId(thread.conversationId);
          // Clear URL params after successful start
          router.replace("/messages");
        } catch (error: any) {
          console.log(error);
          toast.error(
            error.response?.data?.message || "Failed to start conversation",
          );
          router.replace("/messages");
        } finally {
          setIsInitializing(false);
        }
      };

      initConversation();
    }
  }, [searchParams, user, startConversation, router, isInitializing]);

  const handleSelectThread = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Mark as read when opening
    markAsRead(conversationId);
  };

  const handleSendMessage = (content: string) => {
    if (conversation) {
      const otherParticipant = conversation.participants.find(
        (p) => p._id !== user?._id,
      );

      sendMessage({
        conversationId: conversation.conversationId,
        content,
        recipientId: otherParticipant?._id || "",
        propertyId: conversation.relatedProperty?._id,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Real-time communication with landlords and tenants
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:h-[calc(100vh-220px)]">
          {/* Threads List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col lg:min-h-0 max-h-[45vh] lg:max-h-none">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
              {isSocketConnected && (
                <p className="text-xs text-green-600 mt-1">Connected</p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {threadsLoading || isInitializing ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : threads && threads.length > 0 ? (
                <ChatList
                  threads={threads}
                  selectedThreadId={selectedConversationId}
                  onSelectThread={handleSelectThread}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">
                    Start a conversation by contacting a landlord on a property
                    listing
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2 overflow-hidden min-h-[55vh] lg:min-h-0">
            {conversationLoading || isStartingConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-muted-foreground">
                    Loading conversation...
                  </p>
                </div>
              </div>
            ) : conversation ? (
              <MessageThread
                thread={conversation}
                onSendMessage={handleSendMessage}
                isSocketConnected={isSocketConnected}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const MessagesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
};

export default MessagesPage;
