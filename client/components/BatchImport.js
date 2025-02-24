import { useState } from 'react';
import {
  VStack,
  Button,
  Input,
  Text,
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton
} from '@chakra-ui/react';
import { ImportService } from '../services/importService';

const BatchImport = ({ isOpen, onClose, onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const importService = new ImportService();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const importedNFTs = await importService.importNFTs(file);
      
      onImportComplete(importedNFTs);
      toast({
        title: 'Import Successful',
        description: `Imported ${importedNFTs.length} NFTs`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import NFTs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
            />
            <Text fontSize="sm" color="gray.500">
              Supported formats: JSON, CSV
            </Text>
            {loading && (
              <Progress
                value={progress}
                size="sm"
                width="100%"
                colorScheme="purple"
              />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleImport}
            isLoading={loading}
            isDisabled={!file}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BatchImport; 