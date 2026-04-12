import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Explanation, FlowStep } from "./useExplainCode";

export interface Chat {
  id: string;
  title: string;
  code_input: string;
  language: string;
  difficulty_level: string;
  explanation: Explanation | null;
  flow_steps: FlowStep[] | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setChats(data as unknown as Chat[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const saveChat = async (chat: {
    code_input: string;
    language: string;
    difficulty_level: string;
    explanation?: Explanation | null;
    flow_steps?: FlowStep[] | null;
    summary?: string | null;
    title?: string;
  }) => {
    if (!user) return null;

    const title = chat.title || generateTitle(chat.code_input);

    if (activeChat) {
      const { data } = await supabase
        .from("chats")
        .update({
          ...chat,
          title,
          explanation: chat.explanation as any,
          flow_steps: chat.flow_steps as any,
        })
        .eq("id", activeChat)
        .select()
        .single();
      if (data) {
        setChats((prev) => prev.map((c) => (c.id === activeChat ? (data as unknown as Chat) : c)));
      }
      return activeChat;
    } else {
      const { data } = await supabase
        .from("chats")
        .insert({
          user_id: user.id,
          code_input: chat.code_input,
          language: chat.language,
          difficulty_level: chat.difficulty_level,
          explanation: chat.explanation as any,
          flow_steps: chat.flow_steps as any,
          summary: chat.summary,
          title,
        })
        .select()
        .single();
      if (data) {
        const newChat = data as unknown as Chat;
        setChats((prev) => [newChat, ...prev]);
        setActiveChat(newChat.id);
        return newChat.id;
      }
      return null;
    }
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChat === id) setActiveChat(null);
  };

  const renameChat = async (id: string, title: string) => {
    await supabase.from("chats").update({ title }).eq("id", id);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const newChat = () => {
    setActiveChat(null);
  };

  const getActiveChat = () => chats.find((c) => c.id === activeChat) || null;

  return { chats, activeChat, setActiveChat, loading, saveChat, deleteChat, renameChat, newChat, getActiveChat, fetchChats };
}

function generateTitle(code: string): string {
  const firstLine = code.trim().split("\n")[0].slice(0, 50);
  return firstLine || "Untitled Chat";
}
