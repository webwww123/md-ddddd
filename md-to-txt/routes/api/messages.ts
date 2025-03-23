import { Handlers } from "$fresh/server.ts";

// 简单的内存存储，实际应用中应该使用数据库
interface Message {
  id: string;
  name: string;
  content: string;
  timestamp: number;
}

// 模拟数据库
const messages: Message[] = [];

export const handler: Handlers = {
  // 获取所有留言
  GET: (_req) => {
    return new Response(JSON.stringify(messages), {
      headers: { "Content-Type": "application/json" },
    });
  },

  // 添加新留言
  POST: async (req) => {
    try {
      const body = await req.json();
      
      // 验证数据
      if (!body.name || !body.content) {
        return new Response(
          JSON.stringify({ error: "名字和内容不能为空" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 创建新留言
      const newMessage: Message = {
        id: crypto.randomUUID(),
        name: body.name,
        content: body.content,
        timestamp: Date.now(),
      };

      // 添加到留言数组
      messages.unshift(newMessage);
      
      // 如果留言超过100条，删除最旧的
      if (messages.length > 100) {
        messages.pop();
      }

      return new Response(JSON.stringify(newMessage), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "处理请求时出错" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
}; 