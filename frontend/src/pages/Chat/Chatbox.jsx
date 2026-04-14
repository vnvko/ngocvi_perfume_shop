// Chatbox nổi góc phải màn hình — button mở chat, bot tự trả lời, kết nối admin
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';



// Bot tự trả lời đơn giản khi chưa có admin online
const botAutoReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes('giá') || t.includes('bao nhiêu')) return "botPrice";
  if (t.includes('ship') || t.includes('giao hàng') || t.includes('vận chuyển')) return "botShip";
  if (t.includes('chính hãng') || t.includes('auth') || t.includes('thật')) return "botAuth";
  if (t.includes('đổi') || t.includes('trả') || t.includes('return')) return "botReturn";
  return "botDefault";
};

const QUICK_REPLIES = [
  'Giá sản phẩm thế nào?',
  'Phí giao hàng ra sao?',
  'Có phải hàng chính hãng không?',
  'Chính sách đổi trả?',
];

export default function Chatbox() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Xin chào! Em là trợ lý ảo của NGOCVI. Em có thể giúp gì ạ?", time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Tạo hoặc lấy conversation khi user đăng nhập và mở chat
  useEffect(() => {
    if (open && user && !conversationId) {
      api.post('/conversations')
        .then(res => setConversationId(res.data?.id))
        .catch(() => {}); // fallback: chat local nếu API chưa có
    }
  }, [open, user, conversationId]);

  const sendMessage = async (text = input.trim()) => {
    if (!text) return;
    const now = new Date();
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text, time: now }]);
    setInput('');
    setTyping(true);

    // Nếu có conversationId, gửi lên backend
    if (conversationId) {
      try {
        await api.post(`/conversations/${conversationId}/messages`, { message: text, sender_type: 'user' });
      } catch {}
    }

    // Bot tự trả lời sau 1.2s
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: botAutoReply(text),
        time: new Date(),
      }]);
    }, 1200);
  };

  const fmtTime = (d) => new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Floating button khi chưa mở
  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors">
          <FiMessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-2xl flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-dark px-4 py-3 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-serif">N</div>
              <div>
                <p className="text-white font-sans text-sm font-medium">NGOCVI Support</p>
                <p className="text-green-400 text-[10px] font-sans flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-light">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-serif flex-shrink-0 mt-0.5">N</div>
                )}
                <div className={`max-w-[78%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 text-sm font-sans leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-primary text-white rounded-tl-xl rounded-tr-sm rounded-b-xl'
                      : 'bg-white text-dark border border-light-secondary rounded-tr-xl rounded-tl-sm rounded-b-xl shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted font-sans mt-1">{fmtTime(msg.time)}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-serif flex-shrink-0">N</div>
                <div className="bg-white border border-light-secondary px-4 py-3 rounded-tr-xl rounded-b-xl shadow-sm flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-muted rounded-full inline-block animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-light flex gap-2 flex-wrap border-t border-light-secondary">
              {QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs font-sans border border-primary text-primary px-2.5 py-1 hover:bg-primary hover:text-white transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-light-secondary bg-white px-3 py-3 flex items-center gap-2 rounded-b-xl">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={"Gửi tin nhắn..."}
              className="flex-1 text-sm font-sans outline-none text-dark placeholder:text-muted bg-transparent" />
            <button onClick={() => sendMessage()} disabled={!input.trim()}
              className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors disabled:opacity-40">
              <FiSend size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
