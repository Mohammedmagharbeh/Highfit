import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_SOCKET_URL);

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const staffUserStr = sessionStorage.getItem("staffUser");
  const regularUserStr = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token") || sessionStorage.getItem("staffToken");

  let currentUser = null;
  if (staffUserStr) currentUser = JSON.parse(staffUserStr);
  else if (regularUserStr) currentUser = JSON.parse(regularUserStr);

  const userId = currentUser?._id || currentUser?.id;
  const userRole = currentUser?.role;

  const fetchNotifications = async () => {
    if (!token || !currentUser) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleNewNotification = (notification) => {
      if (!currentUser) return;
      
      const isForMe = 
        (notification.targetUserId && notification.targetUserId === userId) ||
        (notification.targetRole && notification.targetRole === userRole);

      if (isForMe) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#111] border border-orange-500 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`} dir="rtl">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Bell className="h-10 w-10 text-orange-500 rounded-full bg-orange-500/10 p-2" />
                </div>
                <div className="mr-3 flex-1 flex flex-col justify-center">
                  <p className="text-sm font-bold text-white">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-400">{notification.content}</p>
                </div>
              </div>
            </div>
          </div>
        ));
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [userId, userRole, token]);

  const markAsRead = async (id) => {
    try {
      if (!token) return;
      await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!token) return;
      await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".notifications-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!currentUser) return null;

  return (
    <div className="relative notifications-container">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-white/80 hover:text-orange-500 transition focus:outline-none flex items-center justify-center mt-1"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-[#0a0a0a]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 mt-2 w-80 bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 z-[1000] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#111]" dir="rtl">
            <h3 className="font-bold text-white">الإشعارات</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-orange-500 hover:text-orange-400 font-bold">
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto w-full custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">لا توجد إشعارات</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 border-b border-white/5 last:border-b-0 transition cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-orange-500/5 hover:bg-orange-500/10' : 'hover:bg-white/[0.02]'}`}
                  onClick={() => handleNotificationClick(notif)}
                  dir="rtl"
                >
                  <div className={`mt-1 flex-shrink-0 ${!notif.isRead ? 'text-orange-500' : 'text-gray-500'}`}>
                    <Bell size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm truncate ${!notif.isRead ? 'font-bold text-white' : 'text-gray-400'}`}>{notif.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{notif.content}</p>
                    <span className="text-[10px] text-gray-600 mt-2 block" dir="ltr">{new Date(notif.timestamp).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  {!notif.isRead && (
                    <div className="flex-shrink-0 flex items-center justify-center w-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
