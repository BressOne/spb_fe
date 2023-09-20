import {
  ApiContext,
  Reservation,
  Restaurant,
  Table,
  Timeframe,
  week,
  WorkingHours,
} from "@/contexts/api";
import { Identity } from "@/contexts/identity";
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
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";

type Props = {
  onClose: (forceReload?: boolean) => Promise<void>;
  userData: Identity;
  tables: Table[];
  currentTableId: string | undefined;
  restaurant: Restaurant;
};

const getRestaurantsWorkingHours = (
  day: Date,
  restaurantworkingHours: WorkingHours
) => {
  const dayIndex = day.getDay();
  const dayName = week[dayIndex];
  return restaurantworkingHours[dayName];
};

const getHoursOptions = (timeframe: Timeframe) => {
  const startHour = Number.parseInt(timeframe.start.split(":")[0], 10);
  const endHour = Number.parseInt(timeframe.end.split(":")[0], 10);
  const hourOptions = [];
  for (let index = 0; index < endHour - startHour; index++) {
    hourOptions.push(startHour + index);
  }
  return hourOptions;
};

const isFormInValid = ({
  day,
  reservationStartHour,
  guestName,
  tableId,
  personsToServe,
}: ModalData) => {
  return (
    !Boolean(day) ||
    !Boolean(reservationStartHour) ||
    !Boolean(guestName) ||
    !Boolean(tableId) ||
    !Boolean(personsToServe)
  );
};

type ModalData = {
  day: Date | undefined;
  reservationStartHour: number | undefined;
  guestName: string | undefined;
  notes: string | undefined;
  personsToServe: number;
  tableId: string | undefined;
};

const AddReservationModal = ({
  onClose,
  tables,
  currentTableId,
  restaurant,
}: Props) => {
  const { addReservation } = useContext(ApiContext);

  const [modalData, setModalData] = useState<ModalData>({
    tableId: currentTableId,
    day: undefined,
    reservationStartHour: undefined,
    guestName: undefined,
    personsToServe: 1,
    notes: undefined,
  });
  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <Modal isOpen={true} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a reservation</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} rowGap={"10px"}>
          <Heading size="sm">Table to reserve</Heading>
          <Select
            placeholder="Select a Table"
            isRequired={true}
            onChange={(e) => {
              setModalData((prev) => ({
                ...prev,
                tableId: e.target.value,
              }));
            }}
          >
            {tables.map((t: Table) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          {modalData.tableId && (
            <>
              <Heading size="sm">Reservation date</Heading>
              <Input
                placeholder="Select Date"
                size="md"
                type="date"
                isInvalid={!modalData.day}
                isRequired={true}
                onChange={(e) => {
                  setModalData((prev) => ({
                    ...prev,
                    day: new Date(e.target.value),
                    reservationStartHour: undefined,
                  }));
                }}
              />
              {modalData.day && (
                <>
                  <Heading size="sm">Reservation start</Heading>
                  <Select
                    placeholder="Select Reservation Start"
                    isInvalid={!modalData.reservationStartHour}
                    isRequired={true}
                    onChange={(e) => {
                      setModalData((prev) => ({
                        ...prev,
                        reservationStartHour: Number.parseInt(
                          e.target.value,
                          10
                        ),
                      }));
                    }}
                  >
                    {getHoursOptions(
                      getRestaurantsWorkingHours(
                        modalData.day,
                        restaurant.workingHours
                      )
                    ).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Select>
                  <Text>NOTE: reservation duration is 1h</Text>
                </>
              )}

              <Heading size="sm">Guest name</Heading>
              <Input
                size="md"
                type="text"
                value={modalData.guestName}
                isRequired={true}
                isInvalid={!modalData.guestName}
                onChange={(e) => {
                  setModalData((prev) => ({
                    ...prev,
                    guestName: e.target.value,
                  }));
                }}
              />
              <Heading size="sm">Number of guests</Heading>
              <Input
                size="md"
                type="number"
                isRequired={true}
                value={modalData.personsToServe}
                onChange={(e) => {
                  setModalData((prev) => ({
                    ...prev,
                    personsToServe: Number.parseInt(e.target.value, 10),
                  }));
                }}
              />
              <Heading size="sm">Notes</Heading>
              <Input
                size="md"
                type="text"
                isRequired={false}
                value={modalData.notes}
                onChange={(e) => {
                  setModalData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }));
                }}
              />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={isFormInValid(modalData) ? "gray" : "blue"}
            mr={3}
            onClick={async () => {
              if (isFormInValid(modalData)) {
                return;
              }
              setIsSubmiting(true);
              const startDate = new Date(modalData.day!);
              startDate.setUTCHours(modalData.reservationStartHour!, 0, 0, 0);

              const endDate = new Date(modalData.day!);
              endDate.setUTCHours(modalData.reservationStartHour! + 1, 0, 0, 0);

              const body: Pick<Reservation, "guestName" | "meta"> = {
                guestName: modalData.guestName!,
                meta: {
                  personsToServe: modalData.personsToServe!,
                  startTime: startDate,
                  endTime: endDate,
                  notes: modalData.notes,
                },
              };
              await addReservation(modalData.tableId!, restaurant.id, body);
              onClose(true);
            }}
            disabled={isFormInValid(modalData)}
            isLoading={isSubmiting}
            _hover={{
              cursor: isFormInValid(modalData) ? "not-allowed" : "pointer",
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

export default AddReservationModal;
