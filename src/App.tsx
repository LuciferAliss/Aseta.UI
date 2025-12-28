import { Box } from "@chakra-ui/react";
import Header from "./components/layout/Header";
import AppRouters from "./components/routers/AppRouters";

function App() {
  return (
    <Box minH="100vh">
      <Header />
      <AppRouters />
    </Box>
  );
}

export default App;
