'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, Circle, Tags } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'System' | 'Approval' | 'User Activity';
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('No Filter');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Campaign Launched',
      message: 'Your campaign "Spring Sale" is now live!',
      time: '2 hours ago',
      read: false,
      category: 'System',
    },
    {
      id: 2,
      title: 'Campaign Approved',
      message: 'Your campaign "Product Hunt Boost" has been approved.',
      time: '1 day ago',
      read: true,
      category: 'Approval',
    },
    {
      id: 3,
      title: 'New Subscriber',
      message: 'A new user subscribed to your campaign!',
      time: '3 days ago',
      read: false,
      category: 'User Activity',
    },
  ]);

  const categoryOptions = ['No Filter', 'System', 'Approval', 'User Activity'];

  const filteredNotifications = notifications.filter((notif) => {
    const readMatch =
      filter === 'all' ? true : filter === 'read' ? notif.read : !notif.read;
    const categoryMatch =
      categoryFilter === 'No Filter' || notif.category === categoryFilter;
    return readMatch && categoryMatch;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          Notifications
        </h1>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Read/Unread Tabs */}
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as 'all' | 'unread' | 'read')}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Dropdown with Label */}
        <div className="flex items-center gap-2">
          <Tags className="w-4 h-4 text-gray-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 text-sm rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification List */}
      <ul className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <li
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-5 rounded-lg border shadow-sm transition cursor-pointer ${
                notif.read
                  ? 'bg-white text-gray-600 border-gray-200'
                  : 'bg-blue-50 text-gray-900 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {notif.read ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-blue-500" />
                  )}
                  <h2 className="text-lg font-semibold">{notif.title}</h2>
                </div>
                <span className="inline-block text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {notif.category}
                </span>
              </div>
              <p>{notif.message}</p>
              <span className="text-sm text-gray-500 mt-2 block">{notif.time}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No notifications found.</p>
        )}
      </ul>
    </div>
  );
}
