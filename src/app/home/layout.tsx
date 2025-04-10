import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Box } from '@mui/material';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Box
          minHeight={"100dvh"}
          sx={{

            width: '100%',
            backgroundImage: {
              xs: `url(/assets/fitness_background_v.png)`,
              md: `url(/assets/fitness_background_h.png)`
            },
            backgroundRepeat: "no-repeat",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}>
        </Box>
        <ThemeProvider >{children}</ThemeProvider>
      </body>
    </html>
  );
}
