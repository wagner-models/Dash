import { Grid } from '@chakra-ui/react';
import PluginCard from './PluginCard';

export default function PluginGrid({ searchQuery, activeFilter }) {
  const plugins = [
    {
      id: 1,
      name: 'Smart Contract Generator',
      description: 'AI-powered smart contract generation and validation',
      price: '5 SOL',
      category: 'Development',
    },
    {
      id: 2,
      name: 'NFT Collection Creator',
      description: 'Create and deploy NFT collections with AI-generated art',
      price: '3 SOL',
      category: 'NFT',
    },
    {
      id: 3,
      name: 'Market Analyzer',
      description: 'Real-time Solana market analysis and predictions',
      price: '2 SOL',
      category: 'Analytics',
    },
    {
      id: 4,
      name: 'Code Reviewer',
      description: 'Automated code review and security analysis',
      price: '4 SOL',
      category: 'Security',
    }
  ];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || plugin.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Grid 
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)"
      }} 
      gap={6}
    >
      {filteredPlugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} />
      ))}
    </Grid>
  );
} 