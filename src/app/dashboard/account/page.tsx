import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { Grid2 } from '@mui/material';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid2 container spacing={3}>
        <Grid2>
          <AccountInfo />
        </Grid2>
        <Grid2 >
          <AccountDetailsForm />
        </Grid2>
      </Grid2>
    </Stack>
  );
}
