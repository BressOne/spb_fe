// app/providers.tsx
"use client";

import { ApiProvider } from "@/contexts/api";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import theme from "./theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <ApiProvider>
          <ChakraProvider>
            {children}
            </ChakraProvider>
        </ApiProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
