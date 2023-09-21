import { Spinner, Flex } from "@chakra-ui/react";

const FullScreenSpinner = () => {
  return (
    <Flex
      h={"100vh"}
      w={"100vw"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Spinner size="xl" />
    </Flex>
  );
};

export default FullScreenSpinner;
