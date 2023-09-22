"use client";

import { ApiContext, Restaurant, week } from "@/contexts/api";
import { Identity } from "@/contexts/identity";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import RestaurantModal from "./editRestaurantModal";

const TableHeading = () => (
  <Tr>
    <Th>Day of the week</Th>
    <Th>Open</Th>
    <Th>Close</Th>
  </Tr>
);

const getOpenHoursList = (rest: Restaurant) => {
  return week.map((w) => {
    const timeframe = rest.workingHours[w];
    return (
      <Tr key={w}>
        <Td>{w.toUpperCase()}</Td>
        <Td>{timeframe.start}</Td>
        <Td>{timeframe.end}</Td>
      </Tr>
    );
  });
};

const Restaurant = ({ userData }: { userData: Identity }) => {
  const { getRestaurant } = useContext(ApiContext);
  const [rest, setRest] = useState<Restaurant | undefined>(undefined);
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const getRestaurants = async () => {
      const data = await getRestaurant(
        userData ? userData.restaurantOrigin : ""
      );
      setRest(data ? data : undefined);
    };

    getRestaurants();
  }, []);

  return rest ? (
    <Center py={6} display={"flex"} flexDirection={"column"}>
      {editModalIsOpen && (
        <RestaurantModal
          restaurant={rest}
          onClose={async (forceReload?: boolean) => {
            if (forceReload && userData) {
              const data = await getRestaurant(userData.restaurantOrigin);
              setRest(data ? data : undefined);
            }
            setEditModalIsOpen(false);
          }}
        />
      )}
      <Box
        w={"full"}
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Image
          h={"120px"}
          w={"full"}
          src={
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
          }
          objectFit="cover"
          alt="#"
        />
        <Flex justify={"center"} mt={-12}>
          <Avatar
            size={"2xl"}
            src={
              "https://c8.alamy.com/comp/2FMAGW7/restaurant-logo-vector-illustration-design-template-2FMAGW7.jpg"
            }
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>

        <Flex justify={"center"} p={6} direction={"column"} align={"center"}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {rest.name}
            </Heading>
          </Stack>

          <Stack spacing={0} align={"center"}>
            <Text fontWeight={600}>Working hours</Text>
            <Text fontWeight={600}>
              Restaurant time offset is{" "}
              {rest.timezoneOffsetMinutes > 0 ? "+" : "-"}
              {rest.timezoneOffsetMinutes / 60} hour(s)
            </Text>
            <Text fontWeight={600}>
              And your current time offset is{" "}
              {new Date().getTimezoneOffset() / 60} hour(s)
            </Text>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>
                  Your awesome {rest.name} restaurants open hours
                </TableCaption>
                <Thead>
                  <TableHeading />
                </Thead>
                <Tbody>{getOpenHoursList(rest)}</Tbody>
                <Tfoot>
                  <TableHeading />
                </Tfoot>
              </Table>
            </TableContainer>
          </Stack>

          <Button
            marginTop={"15px"}
            maxW={"120px"}
            mt={8}
            bg={"gray"}
            color={"white"}
            rounded={"md"}
            _hover={{
              bg: "blackAlpha.200",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => setEditModalIsOpen(true)}
          >
            Edit
          </Button>
        </Flex>
      </Box>
    </Center>
  ) : (
    <Stack padding={4} spacing={1}>
      <Skeleton height="40px" isLoaded={false}></Skeleton>
      <Skeleton
        height="40px"
        isLoaded={false}
        bg="green.500"
        color="white"
        fadeDuration={1}
      ></Skeleton>
      <Skeleton
        height="40px"
        isLoaded={false}
        fadeDuration={4}
        bg="blue.500"
        color="white"
      ></Skeleton>
    </Stack>
  );
};

export default Restaurant;
