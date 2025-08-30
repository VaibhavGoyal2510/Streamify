import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
            {/* So flex-1 flex flex-col means:
👉 “This element is a flex container, its children are stacked vertically, and this container itself will grow to take up as much space as possible in its parent.” */}
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>
          {/* “This element will grow to fill available space, and if its vertical content is too tall, it becomes scrollable.” */}
        </div>
      </div>
    </div>
  );
};
export default Layout;