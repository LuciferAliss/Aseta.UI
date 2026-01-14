import {
  Button,
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

const InventoryCreateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = () => {
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal} w="full">
        Создать инвентарь
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            _focusVisible={{
              ring: "2px",
              ringColor: "btn-focus-ring",
              ringOffset: "2px",
              ringOffsetColor: "app-bg",
            }}
          />
          <Formik initialValues={{ login: "" }} onSubmit={async (value) => {}}>
            {(props) => (
              <Form onSubmit={props.handleSubmit} noValidate>
                <ModalHeader>
                  <Center>
                    <Text fontSize="4xl" as="b">
                      Создание инвентаря
                    </Text>
                  </Center>
                </ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel></FormLabel>
                    <Field />
                    <FormErrorMessage></FormErrorMessage>
                  </FormControl>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InventoryCreateModal;
