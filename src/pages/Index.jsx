import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import OthelloBoard from "../components/OthelloBoard";

const Index = () => {
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Othello
      </Heading>
      <OthelloBoard />
    </Box>
  );
};

export default Index;
