"use client";

import { useEffect, useRef, useState } from "react";
import { MessageThread as MessageThreadType } from "@/types/message";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface MessageThreadProps {
  thread: MessageThreadType;
  onSendMessage: (content: string) => void;
  isSocketConnected: boolean;
}

export const MessageThread = ({
  thread,
  onSendMessage,
  isSocketConnected,
}: MessageThreadProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread.messages]);

  const handleSend = () => {
    if (message.trim() && isSocketConnected) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherParticipant = () => {
    return thread.participants.find((p) => p._id !== user?._id);
  };

  const otherParticipant = getOtherParticipant();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="p-4 rounded-b-none border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherParticipant?.profile.avatar} />
            <AvatarFallback>
              {otherParticipant?.profile.firstName[0]}
              {otherParticipant?.profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {otherParticipant?.profile.firstName}{" "}
              {otherParticipant?.profile.lastName}
            </h3>
            {thread.relatedProperty && (
              <p className="text-sm text-muted-foreground">
                Re: {thread.relatedProperty.title}
              </p>
            )}
          </div>
          {!isSocketConnected && (
            <div className="ml-auto flex items-center gap-2 text-yellow-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Connecting...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((msg, index) => {
          const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
          const isCurrentUser = senderId === user?._id;
          const senderInfo = typeof msg.sender === 'object' ? msg.sender : otherParticipant;

          return (
            <div
              key={index}
              className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={senderInfo?.profile.avatar} />
                  <AvatarFallback className="text-xs">
                    {senderInfo?.profile.firstName[0]}
                    {senderInfo?.profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(msg.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="p-4 rounded-t-none border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[60px] resize-none"
            disabled={!isSocketConnected}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || !isSocketConnected}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {!isSocketConnected && (
          <p className="text-xs text-yellow-600 mt-2">
            Waiting for connection...
          </p>
        )}
      </Card>
    </div>
  );
};
