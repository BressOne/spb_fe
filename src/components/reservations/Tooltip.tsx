import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { ChatIcon, CheckIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export const Content = ({
  children,
  appointmentData,
  ...restProps
}: AppointmentTooltip.ContentProps) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Flex flexDirection={"row"}>
      <Flex width={"64px"} justifyContent={"center"} alignItems={"center"}>
        <ChatIcon boxSize={5} color={"grey"} />
      </Flex>
      {appointmentData && (
        <Flex width={"100%"}>Notes: {appointmentData.meta.notes}</Flex>
      )}
    </Flex>
    <Flex flexDirection={"row"}>
      <Flex width={"64px"} justifyContent={"center"} alignItems={"center"}>
        <CheckIcon boxSize={5} color={"grey"} />
      </Flex>
      {appointmentData && (
        <Flex width={"100%"}>
          Persons to serve: {appointmentData.meta.personsToServe}
        </Flex>
      )}
    </Flex>
  </AppointmentTooltip.Content>
);
