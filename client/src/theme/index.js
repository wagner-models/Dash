import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      variants: {
        ghost: {
          _hover: {
            bg: 'whiteAlpha.200',
          },
        },
      },
    },
  },
});

export default theme; 