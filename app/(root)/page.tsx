import { Button } from "@/components/ui/button";
import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";

const Home = () => {
  return (
    <>
      <BookOverview />
      <BookList />
    </>
  );
};

export default Home;
