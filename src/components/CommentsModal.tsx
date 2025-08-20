import React, { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Send,
  Trash2,
  User,
  Shield,
  Package,
  Loader2,
  Crown,
  Store,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Comment } from "@/types";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  productId,
  productTitle,
}) => {
  const { currentUser } = useUser();
  const { comments, loading, addComment, deleteComment, canDeleteComment } =
    useComments(productId);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await addComment(productId, newComment);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete comment";
      toast.error(errorMessage);
    }
  };

  const formatDate = (date: any) => {
    try {
      let validDate: Date;

      if (!date) return "Unknown date";
      if (date instanceof Date) {
        validDate = date;
      } else if (date && typeof date.toDate === "function") {
        validDate = date.toDate();
      } else if (typeof date === "number") {
        validDate = new Date(date);
      } else if (typeof date === "string") {
        validDate = new Date(date);
      } else if (date && typeof date === "object" && "seconds" in date) {
        validDate = new Date(
          date.seconds * 1000 + (date.nanoseconds || 0) / 1000000,
        );
      } else {
        return "Invalid date";
      }

      if (isNaN(validDate.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(validDate);
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Invalid date";
    }
  };

  const getRoleIcon = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3 text-red-400" />;
      case "shop_access":
        return <Store className="w-3 h-3 text-purple-400" />;
      case "partner":
        return <Crown className="w-3 h-3 text-yellow-400" />;
      default:
        return <UserCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "shop_access":
        return "Shop";
      case "partner":
        return "Partner";
      default:
        return "User";
    }
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/50";
      case "shop_access":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400/50";
      case "partner":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400/50";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/50";
    }
  };

  const getAvatarFallbackColors = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-br from-red-500 to-red-700";
      case "shop_access":
        return "bg-gradient-to-br from-purple-500 to-purple-700";
      case "partner":
        return "bg-gradient-to-br from-yellow-500 to-yellow-700";
      default:
        return "bg-gradient-to-br from-blue-500 to-purple-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-gray-800 max-w-3xl max-h-[85vh] backdrop-blur-lg">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="text-white flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold">Comments</span>
              <p className="text-sm text-gray-400 font-normal mt-1">
                {productTitle}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="text-purple-400 font-medium">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comments List */}
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                    <span className="text-gray-300 text-sm">
                      Loading comments...
                    </span>
                  </div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">No comments yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Be the first to share your thoughts!
                    </p>
                  </div>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <Card
                    key={comment.id}
                    className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-200"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* User Avatar */}
                          <div className="relative">
                            <Avatar className="w-10 h-10 border-2 border-gray-600/50 shadow-lg">
                              <AvatarImage
                                src={comment.avatarUrl}
                                alt={comment.username || "User"}
                                className="object-cover"
                              />
                              <AvatarFallback
                                className={`${getAvatarFallbackColors(comment.userRole)} text-white font-medium`}
                              >
                                {comment.username?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            {/* Role indicator */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-gray-600">
                              {getRoleIcon(comment.userRole || "user")}
                            </div>
                          </div>

                          {/* Comment Content */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Header */}
                            <div className="flex items-center space-x-3 flex-wrap">
                              <span className="text-white font-semibold">
                                {comment.username || "Unknown User"}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getRoleColor(comment.userRole || "user")} px-2 py-1`}
                              >
                                {getRoleLabel(comment.userRole || "user")}
                              </Badge>
                              <span className="text-gray-500 text-xs">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>

                            {/* Comment text */}
                            <p className="text-gray-200 text-sm leading-relaxed break-words">
                              {comment.content || "Content unavailable"}
                            </p>
                          </div>
                        </div>

                        {/* Delete button */}
                        {canDeleteComment(comment) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-3 p-2"
                            title="Delete comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Add Comment Form */}
          {currentUser ? (
            <Card className="border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-start space-x-4">
                    {/* Current user avatar */}
                    <Avatar className="w-10 h-10 border-2 border-purple-500/50 shadow-lg flex-shrink-0">
                      <AvatarImage
                        src={currentUser.avatarUrl}
                        alt={currentUser.username}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className={`${getAvatarFallbackColors(currentUser.role)} text-white font-medium`}
                      >
                        {currentUser.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Comment input */}
                    <div className="flex-1 space-y-3">
                      <Label
                        htmlFor="newComment"
                        className="text-white text-sm font-medium"
                      >
                        Add a comment
                      </Label>
                      <Textarea
                        id="newComment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="bg-black/50 border-gray-600 text-white placeholder:text-gray-500 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        rows={3}
                        maxLength={500}
                      />

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">
                          {newComment.length}/500 characters
                        </span>
                        <Button
                          type="submit"
                          disabled={!newComment.trim() || isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-medium"
                          size="sm"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-center space-y-2">
                  <UserCircle className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-gray-300 font-medium">
                    Sign in to comment
                  </p>
                  <p className="text-gray-500 text-sm">
                    You need to be logged in to share your thoughts
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="border-t border-gray-800 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
