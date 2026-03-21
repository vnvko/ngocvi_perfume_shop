// Admin: Quản lý chatbox — xem hội thoại khách, phản hồi trực tiếp
import { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

export default function AdminChatbox() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    adminAPI.getConversations()
      .then(res => {
        const convs = res.data.conversations || [];
        setConversations(convs);
        if (convs.length) setActiveId(convs[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setMsgLoading(true);
    adminAPI.getMessages(activeId)
      .then(res => setMessages(res.data.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false));
  }, [activeId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeId) return;
    const text = input.trim();
    setInput('');
    try {
      await adminAPI.sendMessage(activeId, text);
      const res = await adminAPI.getMessages(activeId);
      setMessages(res.data.messages || []);
    } catch {}
  };

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <AdminLayout breadcrumb={{ current: 'Chatbox Management' }}>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Left: conversation list */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Danh sách hội thoại</p>
            <p className="text-xs text-gray-400 mt-0.5">{conversations.length} hội thoại</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              Array.from({length:4}).map((_,i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-gray-50 rounded" /></div>)
            ) : conversations.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${activeId === c.id ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium flex-shrink-0">
                    {c.user_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-xs font-medium text-gray-800 truncate">{c.user_name}</p>
                      <p className="text-[10px] text-gray-400 ml-1 flex-shrink-0">{c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'}) : ''}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.last_message}</p>
                  </div>
                </div>
              </button>
            ))}
            {!loading && !conversations.length && <div className="p-8 text-center text-xs text-gray-400">Chưa có hội thoại nào</div>}
          </div>
        </div>

        {/* Right: chat window */}
        <div className="flex-1 flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden">
          {activeConv ? (
            <>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                  {activeConv.user_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{activeConv.user_name}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {msgLoading ? (
                  <div className="text-center text-xs text-gray-400 py-8">Đang tải tin nhắn...</div>
                ) : messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.sender_type !== 'user' && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5 ${msg.sender_type === 'admin' ? 'bg-gray-600' : 'bg-primary'}`}>
                        {msg.sender_type === 'admin' ? 'A' : 'B'}
                      </div>
                    )}
                    <div className={`max-w-[65%] flex flex-col ${msg.sender_type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3.5 py-2.5 text-xs leading-relaxed rounded-xl ${
                        msg.sender_type === 'user' ? 'bg-gray-700 text-white rounded-tr-sm' :
                        msg.sender_type === 'admin' ? 'bg-gray-200 text-gray-800 rounded-tl-sm' :
                        'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(msg.created_at).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})}
                        {msg.sender_type === 'admin' && ' · Admin'}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Gửi tin nhắn..." className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400" />
                <button onClick={sendMessage} disabled={!input.trim()}
                  className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white hover:bg-amber-700 disabled:opacity-40 transition-colors">
                  <FiSend size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              Chọn một hội thoại để bắt đầu
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
