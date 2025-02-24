import { useState } from 'react';
import {
  VStack,
  HStack,
  Button,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Checkbox,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { ExportService } from '../services/exportService';

const ExportData = ({ data, isOpen, onClose }) => {
  const [fileType, setFileType] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    basic: true,
    attributes: true,
    history: false,
    analytics: false
  });
  const toast = useToast();
  const exportService = new ExportService();

  const handleExport = async () => {
    try {
      setLoading(true);
      const filteredData = filterDataBySelection(data);
      await exportService.exportNFTData(filteredData, fileType);
      toast({
        title: 'Export Successful',
        description: 'Your data has been exported successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDataBySelection = (data) => {
    return data.map(item => {
      const filtered = {};
      if (selectedFields.basic) {
        filtered.name = item.name;
        filtered.collection = item.collection;
        filtered.price = item.price;
      }
      if (selectedFields.attributes) {
        filtered.attributes = item.attributes;
      }
      if (selectedFields.history) {
        filtered.history = item.history;
      }
      if (selectedFields.analytics) {
        filtered.analytics = item.analytics;
      }
      return filtered;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export NFT Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>File Format</FormLabel>
              <Select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Include Data</FormLabel>
              <VStack align="start">
                <Checkbox
                  isChecked={selectedFields.basic}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    basic: e.target.checked
                  })}
                >
                  Basic Information
                </Checkbox>
                <Checkbox
                  isChecked={selectedFields.attributes}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    attributes: e.target.checked
                  })}
                >
                  Attributes
                </Checkbox>
                <Checkbox
                  isChecked={selectedFields.history}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    history: e.target.checked
                  })}
                >
                  Transaction History
                </Checkbox>
                <Checkbox
                  isChecked={selectedFields.analytics}
                  onChange={(e) => setSelectedFields({
                    ...selectedFields,
                    analytics: e.target.checked
                  })}
                >
                  Analytics Data
                </Checkbox>
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleExport}
            isLoading={loading}
            isDisabled={!Object.values(selectedFields).some(v => v)}
          >
            Export
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportData; 