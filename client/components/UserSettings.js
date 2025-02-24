import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider
} from '@chakra-ui/react';
import { SettingsService } from '../services/settingsService';

const UserSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const settingsService = new SettingsService();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await settingsService.saveSettings(settings);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section, key, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  if (!settings) return null;

  return (
    <VStack spacing={8} w="full">
      <Heading>Settings</Heading>

      <Tabs w="full">
        <TabList>
          <Tab>General</Tab>
          <Tab>Notifications</Tab>
          <Tab>Display</Tab>
          <Tab>Privacy</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Theme</FormLabel>
                <Select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                >
                  <option value="SOL">SOL</option>
                  <option value="USD">USD</option>
                </Select>
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Sales Notifications</FormLabel>
                <Switch
                  isChecked={settings.notifications.sales}
                  onChange={(e) => updateSettings('notifications', 'sales', e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Listing Notifications</FormLabel>
                <Switch
                  isChecked={settings.notifications.listings}
                  onChange={(e) => updateSettings('notifications', 'listings', e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Price Alerts</FormLabel>
                <Switch
                  isChecked={settings.notifications.priceAlerts}
                  onChange={(e) => updateSettings('notifications', 'priceAlerts', e.target.checked)}
                />
              </FormControl>
            </VStack>
          </TabPanel>

          {/* Display and Privacy panels... */}
        </TabPanels>
      </Tabs>

      <Divider />

      <Button
        colorScheme="purple"
        onClick={handleSave}
        isLoading={loading}
        alignSelf="flex-end"
      >
        Save Settings
      </Button>
    </VStack>
  );
};

export default UserSettings; 