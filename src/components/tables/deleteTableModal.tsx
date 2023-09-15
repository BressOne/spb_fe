import { ApiContext, Restaurant, Timeframe } from "@/contexts/api";
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
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";

type Props = {
  onClose: (forceReload?: boolean) => Promise<void>;
  tableId: string;
};

const DeleteConfirmation = ({ onClose, tableId }: Props) => {
  const { removeTable } = useContext(ApiContext);
  const { userData } = useContext(IdentityContext);

  const [isSubmiting, setIsSubmitting] = useState(false);

  return (
    <Modal isOpen={true} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete the table?</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} rowGap={"10px"}>
          <Heading size="sm">
            You are going to delete table and all reservations. Are you sure?
          </Heading>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={"red"}
            mr={3}
            onClick={async () => {
              setIsSubmitting(true);
              await removeTable(tableId, userData!.restaurantOrigin);
              onClose(true);
            }}
            isLoading={isSubmiting}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
          >
            Delete
          </Button>
          <Button
            isLoading={isSubmiting}
            variant="ghost"
            onClick={() => onClose(false)}
            _hover={{
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

export default DeleteConfirmation;
