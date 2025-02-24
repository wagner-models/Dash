import { Box, Heading, VStack } from '@chakra-ui/react';
import PluginOverview from './PluginOverview';
import TransactionsList from './TransactionsList';
import UserProfile from './UserProfile';

const UserDashboard = ({ plugins, transactions, user }) => {
  return (
    <VStack spacing={8} align="stretch" p="8">
      <Heading as="h1" size="xl">User Dashboard</Heading>
      <PluginOverview plugins={plugins} />
      <TransactionsList transactions={transactions} />
      <UserProfile user={user} />
    </VStack>
  );
};

export default UserDashboard; 