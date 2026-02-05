"use client";

import { MessageThread } from "@/types/message";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface ChatListProps {
  threads: MessageThread[];
  selectedThreadId?: string;
  onSelectThread: (threadId: string) => void;
}

export const ChatList = ({ threads, selectedThreadId, onSelectThread }: ChatListProps) => {
  const { user } = useAuth();

  const getOtherParticipant = (thread: MessageThread) => {
    return thread.participants.find((p) => p._id !== user?._id);
  };

  const getUnreadCount = (thread: MessageThread) => {
    if (!user) return 0;
    return thread.messages.filter(
      (msg) => !msg.read && (typeof msg.sender === 'string' ? msg.sender : msg.sender._id) !== user._id
    ).length;
  };

  const getLastMessage = (thread: MessageThread) => {
    return thread.messages[thread.messages.length - 1];
  };

  if (!threads || threads.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => {
        const otherParticipant = getOtherParticipant(thread);
        const unreadCount = getUnreadCount(thread);
        const lastMessage = getLastMessage(thread);
        const isSelected = selectedThreadId === thread.conversationId;

        return (
          <Card
            key={thread._id}
            className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
              isSelected ? "bg-accent" : ""
            }`}
            onClick={() => onSelectThread(thread.conversationId)}
          >
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={otherParticipant?.profile.avatar} />
                <AvatarFallback>
                  {otherParticipant?.profile.firstName[0]}
                  {otherParticipant?.profile.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold truncate">
                    {otherParticipant?.profile.firstName}{" "}
                    {otherParticipant?.profile.lastName}
                  </h4>
                  {lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lastMessage.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>

                {thread.relatedProperty && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Re: {thread.relatedProperty.title}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {lastMessage.content}
                    </p>
                  )}
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
