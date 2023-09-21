"use client";

import { ApiProvider } from "@/contexts/api";
import { IdentityProvider } from "@/contexts/identity";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import theme from "./theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <ApiProvider>
          <IdentityProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </IdentityProvider>
        </ApiProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
