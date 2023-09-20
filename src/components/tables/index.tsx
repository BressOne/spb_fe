"use client";

import { ApiContext, Restaurant, Table, WorkingHours } from "@/contexts/api";
import { Identity, IdentityContext } from "@/contexts/identity";
import { DeleteIcon, CalendarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Skeleton,
  Table as TableComponent,
  TableCaption,
  TableContainer,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import DeleteConfirmation from "./deleteTableModal";
import AddTableModal from "./addTableModal";

const TableHeading = () => (
  <Tr>
    <Th>#</Th>
    <Th>Name</Th>
    <Th>Action</Th>
  </Tr>
);

const Tables = ({ userData }: { userData: Identity }) => {
  const { push } = useRouter();

  const { getTables } = useContext(ApiContext);

  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [deletionTarget, setDeletionTarget] = useState<string | undefined>(
    undefined
  );
  const [addTableModalIsOpen, setAddTableModalIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getTables(userData.restaurantOrigin).then((data) => {
      setTables(data);
      setIsLoading(false);
    });
  }, [getTables, userData.restaurantOrigin]);

  return (
    <Center py={6} display={"flex"} flexDirection={"column"}>
      {addTableModalIsOpen && (
        <AddTableModal
          onClose={async (forceReload?: boolean) => {
            if (forceReload) {
              !isLoading && setIsLoading(true);
              const data = await getTables(userData!.restaurantOrigin);
              setTables(data);
              setIsLoading(false);
            }
            setAddTableModalIsOpen(false);
          }}
        />
      )}
      {deletionTarget && (
        <DeleteConfirmation
          tableId={deletionTarget}
          onClose={async (forceReload?: boolean) => {
            if (forceReload) {
              !isLoading && setIsLoading(true);
              const data = await getTables(userData!.restaurantOrigin);
              setTables(data);
              setIsLoading(false);
            }
            setDeletionTarget(undefined);
          }}
        />
      )}
      <Box
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
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
          <Stack spacing={0} align={"center"}>
            <Text fontWeight={600}>Tables</Text>
            <TableContainer>
              <TableComponent variant="simple">
                <TableCaption>
                  Your awesome restaurants list of tables
                </TableCaption>
                <Thead>
                  <TableHeading />
                </Thead>
                <Tbody>
                  {tables.map((t, i) => {
                    return (
                      <Tr key={i}>
                        <Th>{i + 1}</Th>
                        <Th>{t.name}</Th>
                        <Th>
                          <IconButton
                            variant="outline"
                            colorScheme="teal"
                            aria-label="Delete the table"
                            fontSize="20px"
                            icon={
                              <DeleteIcon
                                onClick={() => {
                                  setDeletionTarget(t.id);
                                }}
                              />
                            }
                          />
                          <IconButton
                            variant="outline"
                            colorScheme="teal"
                            aria-label="Delete the table"
                            fontSize="20px"
                            margin={"5px"}
                            onClick={() => {
                              push(`/table/${t.id}/reservations`);
                            }}
                            icon={<CalendarIcon />}
                          />
                        </Th>
                      </Tr>
                    );
                  })}
                </Tbody>

                <Tfoot>
                  <TableHeading />
                </Tfoot>
              </TableComponent>
            </TableContainer>
          </Stack>
          <Button
            marginTop={"15px"}
            maxW={"140px"}
            mt={8}
            bg={"#151f21"}
            color={"white"}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={() => setAddTableModalIsOpen(true)}
          >
            Add a new table
          </Button>
        </Flex>
      </Box>
    </Center>
  );
};

export default Tables;
