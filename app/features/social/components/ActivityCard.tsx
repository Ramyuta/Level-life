"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import { useTranslation } from "../../i18n/useTranslation";
import type { Activity, Reaction, Comment } from "../../../lib/types";

interface ActivityCardProps {
  activity: Activity;
  reactions: Reaction[];
  comments: Comment[];
  currentUserId: string;
  onAddReaction: () => void;
  onRemoveReaction: () => void;
  onAddComment: (content: string) => void;
}

export default function ActivityCard({
  activity,
  reactions,
  comments,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  onAddComment,
}: ActivityCardProps) {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const hasLiked = reactions.some((r) => r.userId === currentUserId);
  const likeCount = reactions.length;

  const handleToggleLike = () => {
    if (hasLiked) {
      onRemoveReaction();
    } else {
      onAddReaction();
    }
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t("social.justNow");
    if (diffMins < 60) return `${diffMins}${t("social.minutesAgo")}`;
    if (diffHours < 24) return `${diffHours}${t("social.hoursAgo")}`;
    return `${diffDays}${t("social.daysAgo")}`;
  };

  return (
    <div className="rounded-2xl bg-slate-800/50 p-6 ring-1 ring-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Avatar
          avatarId={activity.userAvatar}
          name={activity.userName}
          size="md"
        />
        <div className="flex-1">
          <p className="font-semibold text-white">{activity.userName}</p>
          <p className="text-sm text-slate-400">
            {getTimeAgo(activity.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-slate-200">
          {t("social.completed")}{" "}
          <span className="font-bold text-white">{activity.questTitle}</span>
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="rounded-lg bg-indigo-500/20 px-3 py-1 text-sm font-bold text-indigo-300">
            +{activity.xpEarned} XP
          </div>
          {activity.categoryIcon && (
            <span className="text-2xl">{activity.categoryIcon}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-4">
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
            hasLiked
              ? "bg-rose-500/20 text-rose-400"
              : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <Heart className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`} />
          <span className="text-sm font-semibold">{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-2 text-slate-400 transition-all hover:bg-slate-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
          {/* Comment List */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                avatarId={comment.userAvatar}
                name={comment.userName}
                size="sm"
              />
              <div className="flex-1 rounded-lg bg-slate-700/30 p-3">
                <p className="text-sm font-semibold text-white">
                  {comment.userName}
                </p>
                <p className="mt-1 text-sm text-slate-300">{comment.content}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {getTimeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {/* Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              placeholder={t("social.writeComment")}
              className="flex-1 rounded-lg bg-slate-700/50 px-4 py-2 text-sm text-white placeholder-slate-400 outline-none ring-1 ring-white/5 transition-all focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="rounded-lg bg-indigo-600 p-2 text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
