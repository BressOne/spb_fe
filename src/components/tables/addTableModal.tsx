import { ApiContext } from "@/contexts/api";
import { IdentityContext } from "@/contexts/identity";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";

type Props = {
  onClose: (forceReload?: boolean) => Promise<void>;
};

const nameIsInvalid = (str: string) => str.length < 2;

const AddTableModal = ({ onClose }: Props) => {
  const { addTable } = useContext(ApiContext);
  const { userData } = useContext(IdentityContext);
  const [modalData, setModalData] = useState<{ name: string }>({ name: "" });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const isFormInValid = nameIsInvalid(modalData.name);

  return (
    <Modal isOpen={true} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a table</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} rowGap={"10px"}>
          <Heading size="sm">Dummy</Heading>
          <Input
            placeholder="Table name"
            size="md"
            type="text"
            value={modalData.name}
            isInvalid={nameIsInvalid(modalData.name)}
            onChange={(e) => {
              setModalData({ name: e.target.value });
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={isFormInValid ? "gray" : "blue"}
            mr={3}
            onClick={async () => {
              setIsSubmiting(true);
              const { name } = modalData;
              await addTable(userData!.restaurantOrigin);
              onClose(true);
            }}
            disabled={isFormInValid}
            isLoading={isSubmiting}
            _hover={{
              bg: "blackAlpha.200",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
          >
            Save
          </Button>
          <Button
            isLoading={isSubmiting}
            variant="ghost"
            onClick={() => onClose(false)}
            _hover={{
              bg: "blackAlpha.200",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
          >
            Discard
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTableModal;
