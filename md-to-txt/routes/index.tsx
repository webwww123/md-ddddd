import MarkdownConverter from "../islands/MarkdownConverter.tsx";
import MessageBoard from "../islands/MessageBoard.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto flex flex-col items-center">
        <h1 class="text-3xl font-bold text-center mb-2">去他妈的MD</h1>
        <p class="text-gray-600 mb-8 text-center">
          一个简单高效的工具，帮助您将Markdown格式转换为纯文本
        </p>
        
        <MarkdownConverter />
        
        <MessageBoard />
        
        <footer class="mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MD to TXT 工具 | 基于 Deno Fresh 开发
        </footer>
      </div>
    </div>
  );
}
