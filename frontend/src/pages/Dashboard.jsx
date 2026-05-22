import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden text-white bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        <ChatContainer />
      </main>
    </div>
  );
}