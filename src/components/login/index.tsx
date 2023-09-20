"use client";

import { ReactElement, useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ApiContext } from "@/contexts/api";
import { Identity, IdentityContext } from "@/contexts/identity";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";

type Credentials<T = string> = { username: T; password: T };

export default function Login() {
  const { login } = useContext(ApiContext);
  const { setUserData, userData } = useContext(IdentityContext);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [creds, setCreds] = useState<Credentials<string | undefined>>({
    username: undefined,
    password: undefined,
  });

  useEffect(() => {
    if (userData) {
      redirect("/restaurant");
    }
  }, [userData]);

  const isFormInValid =
    Boolean(loginError) || !Boolean(creds.username) || !Boolean(creds.password);

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={"white"}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Enter username and password
        </Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            borderColor={Boolean(loginError) ? "red" : "grey"}
            onChange={(e) => {
              setLoginError(undefined);
              setCreds((prev) => ({ ...prev, username: e.target.value }));
            }}
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            borderColor={Boolean(loginError) ? "red" : "grey"}
            onChange={(e) => {
              setLoginError(undefined);
              setCreds((prev) => ({ ...prev, password: e.target.value }));
            }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6}>
          {loginError && <Text color="red">{loginError}</Text>}{" "}
          <Button
            colorScheme={isFormInValid ? "gray" : "blue"}
            mr={3}
            disabled={isFormInValid}
            isLoading={isSubmiting}
            _hover={{
              cursor: isFormInValid ? "not-allowed" : "pointer",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            onClick={async () => {
              setIsSubmiting(true);
              try {
                const { username, password } = creds;
                const data = await login({ username, password });
                // setUserData(data as Identity);
              } catch (error) {
                if (isAxiosError(error) && error.status === 403) {
                  setLoginError("Incorrect username and or password");
                } else {
                  setLoginError("Some error occured - try again");
                }

                setIsSubmiting(false);
              }
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
