'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, MessageCircle, X } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  user_email: string
  created_at: string
  user_profiles?: {
    username: string
    avatar_url: string
  }
}

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getAuth()

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*, user_profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) setMessages(data.reverse())
    }

    fetchMessages()

    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select('*, user_profiles(username, avatar_url)')
            .eq('id', payload.new.id)
            .single()
          
          if (data) {
            setMessages((prev) => {
              const updated = [...prev, data]
              return updated.slice(-5)
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    const { error } = await supabase.from('chat_messages').insert([
      {
        content: newMessage,
        user_email: currentUser.email,
        user_id: currentUser.id
      }
    ])

    if (!error) setNewMessage('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card flex justify-between items-center">
            <h3 className="font-bold text-lg">Chat Room</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-accent p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            
            <div className="h-full p-4 overflow-hidden flex flex-col justify-end gap-4">
              {messages.map((msg) => {
                const isMe = msg.user_email === currentUser?.email
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image 
                          src={msg.user_profiles?.avatar_url || 'https://img.daisyui.com/images/profile/demo/anakeen@192.webp'} 
                          alt="avatar" 
                          width={32} 
                          height={32} 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs font-semibold opacity-70">
                            {isMe ? 'You' : (msg.user_profiles?.username || 'User')}
                          </span>
                          <span className="text-[10px] opacity-40">
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </span>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          isMe 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-secondary text-secondary-foreground rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={currentUser ? "Type a message..." : "Login to chat"}
              disabled={!currentUser}
              className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              type="submit" 
              disabled={!currentUser || !newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
