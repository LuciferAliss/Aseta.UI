import { Flex } from "@chakra-ui/react";
import Header from "./components/layout/Header";
import AppRouters from "./components/routers/AppRouters";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/layout/ScrollToTopButton";

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex="1" direction="column">
        <AppRouters />
      </Flex>
      <Footer />
      <ScrollToTopButton />
    </Flex>
  );
}

export default App;
