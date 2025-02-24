import {
  VStack,
  Box,
  Text,
  Badge,
  Link
} from '@chakra-ui/react';

const ActivityFeed = ({ activities }) => {
  const getActivityColor = (type) => {
    switch (type) {
      case 'sale': return 'green';
      case 'purchase': return 'blue';
      case 'list': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {activities.map((activity, index) => (
        <Box
          key={index}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          _hover={{ bg: 'gray.50' }}
        >
          <HStack justify="space-between">
            <Badge colorScheme={getActivityColor(activity.type)}>
              {activity.type}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {new Date(activity.timestamp).toLocaleString()}
            </Text>
          </HStack>
          <Text mt={2}>{activity.nftName}</Text>
          <Text fontWeight="bold">{activity.price} SOL</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default ActivityFeed; 