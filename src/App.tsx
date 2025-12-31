import { Flex } from "@chakra-ui/react";
import Header from "./components/layout/Header";
import AppRouters from "./components/routers/AppRouters";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <AppRouters />
      <Footer />
    </Flex>
  );
}

export default App;
