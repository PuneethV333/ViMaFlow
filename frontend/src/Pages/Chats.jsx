import React, { useState, useEffect, useRef, useContext } from "react";
import { Send, Search, ArrowLeft, Paperclip, Smile } from "lucide-react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";
import { io } from "socket.io-client";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState(null);

  const { userData, allUsers } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const auth = getAuth();
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const SOCKET_URL =
    import.meta.env.VITE_SOCKETIO_URL || "http://localhost:5001";

  useEffect(() => {
    const getToken = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          setFirebaseToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting Firebase token:", error);
        }
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!firebaseToken || !userData) return;

    const socket = io(SOCKET_URL, {
      auth: { token: firebaseToken, userId: userData._id },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      if (activeUser) {
        socket.emit("joinRoom", {
          senderId: userData._id,
          receiverId: activeUser._id,
        });
      }
    });

    socket.on("receiveMessage", (data) => handleWebSocketMessage(data));
    socket.on("disconnect", () => console.log("❌ Socket.IO disconnected"));
    socket.on("connect_error", (err) => console.error("Socket.IO error:", err));

    return () => socket.disconnect();
  }, [firebaseToken, userData, activeUser]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!activeUser || !userData || !firebaseToken) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/chats/${userData._id}/${activeUser._id}`
        );
        setChats(response.data);
        setTimeout(() => scrollToBottom(), 100);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [activeUser, userData, firebaseToken]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWebSocketMessage = (message) => {
    if (
      message.senderId === activeUser?._id ||
      message.receiverId === activeUser?._id
    ) {
      setChats((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeUser || !userData) return;

    const messageData = {
      senderId: userData._id,
      receiverId: activeUser._id,
      message: input,
      createdAt: new Date().toISOString(),
    };

    setChats((prev) => [...prev, messageData]);
    setInput("");

    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", messageData);
    }

    try {
      await axios.post(`${BACKEND_URL}/api/chats`, messageData);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSelectUser = (user) => {
    setActiveUser(user);
    if (socketRef.current?.connected) {
      socketRef.current.emit("joinRoom", {
        senderId: userData._id,
        receiverId: user._id,
      });
    }
  };

  const filteredUsers = (allUsers || [])
  
  .filter((user) => user._id !== userData?._id)
  
  .filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    setIsMobileView(window.innerWidth < 768);
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden ">
      <div
        className={`${isMobileView && activeUser ? "hidden" : "flex"} flex-col w-full md:w-96 bg-gray-800 border-r border-gray-700 transition-all duration-300`}
      >
        <div className="bg-slate-500/40 text-white p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">ViMa-Chat</h1>
            <a href="/" className="block">
              <img
                src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
                alt="ViMa-Flow"
                className="w-28 drop-shadow-lg hidden sm:block"
              />
              <img
                src="https://res.cloudinary.com/deymewscv/image/upload/v1760798310/make_the_background_emesg0.png"
                alt="ViMa-Flow"
                className="w-24 drop-shadow-lg block sm:hidden"
              />
            </a>
          </div>

          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/15 text-white placeholder-gray-300 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:bg-white/25 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`px-4 py-3 md:px-6 cursor-pointer transition-all duration-200 border-b border-gray-700 hover:bg-gray-700 ${
                  activeUser?._id === user._id
                    ? "bg-gray-700 border-l-4 border-l-emerald-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        user.profilePic ||
                        `https://ui-avatars.com/api/?name=${user.displayName}&background=random&bold=true`
                      }
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-100 truncate">
                        {user.displayName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
              {allUsers?.length === 0 ? "Loading users..." : "No chats found"}
            </div>
          )}
        </div>
      </div>

      <div
        className={`${isMobileView && !activeUser ? "hidden" : "flex"} flex-1 flex-col bg-[url('https://res.cloudinary.com/deymewscv/image/upload/v1760816654/create_a_dark-themed_alysmn.png')] bg-no-repeat bg-[#0A0F1C] transition-all duration-300`}
      >
        {activeUser ? (
          <>
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between sticky top-0 z-10 shadow-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isMobileView && (
                  <button
                    onClick={() => setActiveUser(null)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} className="text-gray-300" />
                  </button>
                )}
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      activeUser.profilePic ||
                      `https://ui-avatars.com/api/?name=${activeUser.displayName}&background=random&bold=true`
                    }
                    alt="avatar"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  {activeUser.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-100">
                    {activeUser.displayName}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400">
                    {activeUser.status === "online"
                      ? "Active now"
                      : `Last seen ${activeUser.lastSeen}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-3 md:space-y-4 overflow-y-auto ">
              {chats.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-center">
                  <div>
                    <img
                      src={
                        activeUser.profilePic ||
                        `https://ui-avatars.com/api/?name=${activeUser.displayName}&background=random&bold=true`
                      }
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3 opacity-50"
                    />
                    <p className="font-semibold text-gray-300">
                      Start a conversation
                    </p>
                    <p className="text-sm">
                      Say hello to {activeUser.displayName}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {chats.map((msg, i) => (
                    <div
                      key={msg._id + i}
                      className={`flex ${msg.senderId === userData?._id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm md:text-base break-words shadow-md animate-fadeIn ${
                          msg.senderId === userData?._id
                            ? "bg-emerald-600 text-white rounded-br-none hover:bg-emerald-700"
                            : "bg-gray-700 text-gray-100 rounded-bl-none hover:bg-gray-600"
                        } transition-colors`}
                      >
                        {msg.message}
                        <div
                          className={`text-[11px] md:text-xs mt-1.5 flex justify-between ${msg.senderId === userData?._id ? "text-emerald-200" : "text-gray-400"}`}
                        >
                          <span>
                            {msg.senderId === userData?._id
                              ? "(You)"
                              : activeUser.displayName}
                          </span>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-center text-gray-400 text-sm">
                      Loading messages...
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-gray-800 border-t border-gray-700 p-4 sticky bottom-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message"
                    rows="1"
                    className="w-full bg-gray-700 text-gray-100 placeholder-gray-500 px-4 py-2.5 rounded-full focus:outline-none focus:bg-gray-600 transition-colors resize-none border border-gray-600 focus:border-emerald-500"
                    style={{ maxHeight: "100px" }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  className="p-2.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-full flex-shrink-0 active:scale-95 duration-100"
                >
                  {input.trim() ? <Send size={20} /> : <Smile size={20} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-gray-400 text-center flex-col">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-semibold text-lg text-gray-300">
              Select a chat to start messaging
            </p>
            <p className="text-sm">Choose a conversation or start a new one</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Chats;
