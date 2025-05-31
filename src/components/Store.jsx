import Navbar from "./Navbar";
import SearchBar from "./SearchBar"; // Reuse your full product filter UI

const Store = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
    </div>
    </>
  );
};

export default Store;
