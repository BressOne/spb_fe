"use client";

import { Box, Flex, Button, Stack } from "@chakra-ui/react";

import { useContext } from "react";
import { IdentityContext } from "@/contexts/identity";

export default function WithSubnavigation() {
  const { destroyUser, userData } = useContext(IdentityContext);

  return userData ? (
    <Flex
      minH={"60px"}
      align={"center"}
      display={"flex"}
      justifyContent={"space-between"}
      m={1}
    >
      <Flex display={"flex"} justify={{ md: "start" }}>
        <Flex display={{ md: "flex" }} ml={10}>
          <DesktopNav />
        </Flex>
      </Flex>

      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <Button
          fontSize={"sm"}
          fontWeight={400}
          onClick={() => destroyUser()}
          _hover={{
            cursor: "pointer",
            transform: "translateY(-2px)",
            bg: "blackAlpha.200",
          }}
        >
          Log out
        </Button>
      </Stack>
    </Flex>
  ) : null;
}

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Box
            as="a"
            p={2}
            href={navItem.href ?? "#"}
            fontSize={"sm"}
            fontWeight={500}
          >
            {navItem.label}
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
};

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Tables",
    href: "/tables",
  },
  {
    label: "Restaurant",
    href: "/restaurant",
  },
  {
    label: "Reservations",
    href: "/reservations",
  },
];
