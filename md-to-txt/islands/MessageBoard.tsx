import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { Signal, signal } from "@preact/signals";

interface Message {
  id: string;
  name: string;
  content: string;
  timestamp: number;
}

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // 获取留言
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("获取留言失败", err);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取留言
  useEffect(() => {
    fetchMessages();
  }, []);

  // 提交新留言
  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 验证表单
    if (!name.trim() || !content.trim()) {
      setError("名字和留言内容不能为空");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "提交留言失败");
      }

      // 清空表单并刷新留言
      setName("");
      setContent("");
      fetchMessages();
    } catch (err) {
      console.error("提交留言失败", err);
      setError(err instanceof Error ? err.message : "提交留言失败");
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div class="w-full max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-6 text-center">留言板</h2>
      
      {/* 留言表单 */}
      <form onSubmit={handleSubmit} class="mb-8">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 mb-2">
            您的名字
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的名字"
            maxLength={20}
          />
        </div>
        
        <div class="mb-4">
          <label for="content" class="block text-gray-700 mb-2">
            留言内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的留言"
            rows={3}
            maxLength={200}
          ></textarea>
        </div>
        
        {error && (
          <div class="mb-4 text-red-500 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {loading ? "提交中..." : "发表留言"}
        </button>
      </form>
      
      {/* 留言列表 */}
      <div class="space-y-4">
        <h3 class="text-xl font-medium mb-4 border-b pb-2">
          最近的留言 ({messages.length})
        </h3>
        
        {loading && messages.length === 0 ? (
          <div class="text-center py-4 text-gray-500">加载中...</div>
        ) : messages.length === 0 ? (
          <div class="text-center py-4 text-gray-500">暂无留言，快来留下第一条吧！</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} class="border-b pb-3 last:border-b-0">
              <div class="flex justify-between items-start">
                <span class="font-medium">{message.name}</span>
                <span class="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
              </div>
              <p class="mt-1 text-gray-700 whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 