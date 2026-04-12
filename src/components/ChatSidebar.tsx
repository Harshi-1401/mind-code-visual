import { useState } from "react";
import { Plus, MessageSquare, Trash2, Pencil, Check, X, Search, LogOut, Moon, Sun, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import type { Chat } from "@/hooks/useChats";
import { cn } from "@/lib/utils";

interface Props {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function ChatSidebar({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat, onRenameChat, isDark, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filtered = chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const startRename = (chat: Chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const confirmRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameChat(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar-background border-r border-sidebar-border">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="gradient-primary rounded-lg p-1.5">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-sidebar-foreground">Code Explainer</span>
        </div>
        <Button onClick={onNewChat} className="w-full gradient-primary text-primary-foreground text-xs h-8 font-semibold" size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="h-8 text-xs pl-8 bg-sidebar-accent border-sidebar-border"
          />
        </div>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-1 space-y-0.5">
          {filtered.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-1.5 rounded-md px-2 py-1.5 cursor-pointer text-xs transition-colors",
                activeChat === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {editingId === chat.id ? (
                <div className="flex-1 flex items-center gap-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-6 text-xs px-1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); confirmRename(); }}><Check className="h-3 w-3 text-primary" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }}><X className="h-3 w-3 text-muted-foreground" /></button>
                </div>
              ) : (
                <>
                  <span className="flex-1 truncate">{chat.title}</span>
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); startRename(chat); }} className="p-0.5 rounded hover:bg-background/50">
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="p-0.5 rounded hover:bg-destructive/20">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No chats yet</p>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" size="sm" onClick={onToggleTheme} className="w-full justify-start text-xs text-sidebar-foreground h-8">
          {isDark ? <Sun className="h-3.5 w-3.5 mr-2" /> : <Moon className="h-3.5 w-3.5 mr-2" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </Button>
        <div className="flex items-center gap-2 px-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="flex-1 text-xs text-sidebar-foreground truncate">{user?.email}</span>
          <button onClick={signOut} className="p-1 rounded hover:bg-sidebar-accent" title="Sign out">
            <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
