import { Controller } from 'react-hook-form';
import { Box, MenuItem, Select, Typography } from '@mui/material';

interface DataStructure {
  value: string;
  id: string;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
interface DropdownInputProps {
  control: any;
  title?: string;
  data: DataStructure[];
  value: string;
  error?: string;
  placeholder?: string;
  styles?: any;
  selectStyles?: any;
  isRequired: boolean;
  icon?: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const DropdownInput = (props: DropdownInputProps) => {
  const { control, title, value, error, isRequired, placeholder, styles, data, selectStyles, icon } = props;

  return (
    <Box sx={styles}>
      <Controller
        name={value}
        control={control}
        rules={{ required: isRequired }}
        render={({ field: { onChange, value } }) => (
          <>
            {title && (
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  fontSize: '18px',
                  margin: 0,
                  padding: 0,
                  fontWeight: 500,
                }}>
                {title}
              </Typography>
            )}
            <Select
              IconComponent={icon}
              error={Boolean(error)}
              inputProps={{
                'aria-label': error,
              }}
              labelId={value}
              id={value}
              value={value}
              onChange={onChange}
              sx={{
                width: '100%',
                height: '49px',
                '&>svg': {
                },
                '& .MuiSelect-iconOpen': {
                  transform: 'none',
                },
                textAlign: 'left',
                ...selectStyles,
              }}>
              {data.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                fontSize: '0.75rem',
                margin: 0,
                padding: 0,
                fontWeight: 400,
                lineHeight: '1.66',
                letterSpacing: '0.03333em',
                paddingLeft: '15px',
                paddingTop: '3px',
              }}>
              {error}
            </Typography>
          </>
        )}
      />
    </Box>
  );
};

export default DropdownInput;
