import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const PurchaseModal = ({ isOpen, onClose, onConfirm, plugin }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Purchase</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to purchase {plugin.name}?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseModal; 