import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <IconButton
          borderRadius="full"
          size="lg"
          aria-label="Scroll to top"
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          position="fixed"
          bottom="5rem"
          right={{ base: "1rem", md: "3rem" }}
          zIndex="sticky"
        />
      )}
    </>
  );
};

export default ScrollToTopButton;
