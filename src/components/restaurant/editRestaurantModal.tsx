import { ApiContext, Restaurant, Timeframe } from "@/contexts/api";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Heading,
  Flex,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { week } from "./index";

type Props = {
  restaurant: Restaurant;
  onClose: (forceReload?: boolean) => Promise<void>;
};

const getNumFromTime = (time: string) =>
  Number.parseInt(time.split(":").join(), 10);

const nameIsInvalid = (str: string) => str.length < 2;
const offsetIsInvalid = (num: number) => num < -12 || num > 13;
const timeframeIsInvalid = ({ start, end }: Timeframe) =>
  getNumFromTime(start) > getNumFromTime(end);

const RestaurantModal = ({ restaurant, onClose }: Props) => {
  const { editRestaurant } = useContext(ApiContext);
  const [modalData, setModalData] = useState({ ...restaurant });
  const [isSubmiting, setIsSubmitting] = useState(false);
  const isFormInValid =
    nameIsInvalid(modalData.name) ||
    offsetIsInvalid(modalData.timezoneOffsetMinutes) ||
    week.some((w) => timeframeIsInvalid(modalData.workingHours[w]));
  return (
    <Modal isOpen={true} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit restaurant</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} rowGap={"10px"}>
          <Heading size="sm">Restaurants name</Heading>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="text"
            value={modalData.name}
            isInvalid={nameIsInvalid(modalData.name)}
            onChange={(e) => {
              setModalData((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
          <Heading size="sm">Restaurants timezone offset hours</Heading>
          <Input
            type="number"
            value={modalData.timezoneOffsetMinutes / 60}
            isInvalid={offsetIsInvalid(modalData.timezoneOffsetMinutes / 60)}
            onChange={(e) => {
              setModalData((prev) => ({
                ...prev,
                timezoneOffsetMinutes: Number.parseInt(e.target.value, 10) * 60,
              }));
            }}
          ></Input>
          <Heading size="sm">
            Restaurants working hours in the restaurants timezone
          </Heading>
          {week.map((w) => {
            const { start, end } = modalData.workingHours[w];
            const frameIsInvalid = timeframeIsInvalid({ start, end });
            return (
              <Flex
                flexDirection={"row"}
                justifyContent={"space-between"}
                key={w}
              >
                <Box width={"25%"}>{w}</Box>
                <Input
                  width={"25%"}
                  placeholder="Select Start Time"
                  size="sm"
                  type="time"
                  isInvalid={frameIsInvalid}
                  value={start}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        [w]: {
                          ...prev.workingHours[w],
                          start: e.target.value,
                        },
                      },
                    }))
                  }
                />
                <Input
                  width={"25%"}
                  key={w}
                  placeholder="Select Closing Time"
                  size="sm"
                  type="time"
                  isInvalid={frameIsInvalid}
                  value={end}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        [w]: {
                          ...prev.workingHours[w],
                          end: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </Flex>
            );
          })}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={isFormInValid ? "gray" : "blue"}
            mr={3}
            onClick={async () => {
              if (isFormInValid) {
                setIsSubmitting(true);
                const { name, workingHours, timezoneOffsetMinutes } = modalData;
                await editRestaurant(modalData.id, {
                  name,
                  workingHours,
                  timezoneOffsetMinutes,
                });
                onClose(true);
              }
            }}
            disabled={isFormInValid}
            isLoading={isSubmiting}
            _hover={{
              cursor: isFormInValid ? "not-allowed" : "pointer",
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

export default RestaurantModal;
