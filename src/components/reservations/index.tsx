"use client";
import { useContext, useEffect, useState, ReactNode } from "react";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
  GroupingState,
  Resources,
  IntegratedGrouping,
  ChangeSet,
  Resource,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip,
  ConfirmationDialog,
  TodayButton,
  GroupingPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { ApiContext, Restaurant, Table } from "@/contexts/api";
import { Identity } from "@/contexts/identity";
import { Flex, Heading, Button } from "@chakra-ui/react";
import { connectProps } from "@devexpress/dx-react-core";
import Paper from "@mui/material/Paper";
import AddReservationModal from "./AddReservationModal";
import {
  Instance,
  TableReservation,
  TableFilter,
  TableChange,
  all,
} from "./types";
import { getAllInstances, getAllReservations, stringToColour } from "./utills";
import { Content } from "./Tooltip";
import { FlexibleSpace } from "./FlexibleToolbar";

const grouping = [
  {
    resourceName: "tableId",
  },
];

const Schedule = ({
  userData,
  tables,
  restaurant,
  tableId,
}: {
  userData: Identity;
  tables: Table[];
  restaurant: Restaurant;
  tableId?: string;
}) => {
  const { removeReservation, getRestaurantsReservations } =
    useContext(ApiContext);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTable, setCurrentTable] = useState<TableFilter>(tableId || all);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [tableReservations, setTableReservations] = useState<
    TableReservation[]
  >([]);
  const [resources, setResources] = useState<Resource[]>([
    {
      fieldName: "tableId",
      title: "Tables",
      instances: getAllInstances(tables).filter((i) =>
        tableId ? i.id === tableId : true
      ),
    },
  ]);

  useEffect(() => {
    getRestaurantsReservations(userData.restaurantOrigin).then((reservations) =>
      setTableReservations(
        getAllReservations(reservations, tables, userData.restaurantOrigin)
      )
    );
  }, [getRestaurantsReservations, tables, userData.restaurantOrigin]);

  const commitChanges = async ({ deleted }: ChangeSet) => {
    if (deleted) {
      const reservationsEntity = tableReservations.find(
        (tr) => tr.id === deleted
      );
      reservationsEntity &&
        (await removeReservation({
          reservationId: reservationsEntity.id,
          tableId: reservationsEntity.tableId,
          restaurantId: reservationsEntity.restaurantId,
        }));

      const reservations = await getRestaurantsReservations(
        userData.restaurantOrigin
      );
      setTableReservations(
        getAllReservations(reservations, tables, userData.restaurantOrigin)
      );
    }
  };

  const tableChange: TableChange = (value) => {
    const allInstances = getAllInstances(tables);
    let newInstances: Instance[] = [];
    if (value === "All") {
      newInstances = allInstances;
    } else {
      const single = getAllInstances(tables).find((i) => i.id === value);
      newInstances = single ? [single] : allInstances;
    }

    const nextResources = [
      {
        ...resources[0],
        instances: newInstances,
      },
    ];

    setResources(nextResources);
    setCurrentTable(value);
  };

  const flexibleSpace = connectProps(FlexibleSpace, () => {
    return {
      table: currentTable,
      tables,
      tableChange: tableChange,
    };
  });

  const modalCb = async (forceReload?: boolean) => {
    if (forceReload) {
      getRestaurantsReservations(userData.restaurantOrigin).then(
        (reservations) =>
          setTableReservations(
            getAllReservations(reservations, tables, userData.restaurantOrigin)
          )
      );
    }
    setAddModalIsOpen(false);
  };

  return (
    <>
      {addModalIsOpen && (
        <AddReservationModal
          userData={userData}
          tables={tables}
          currentTableId={currentTable === all ? undefined : currentTable}
          restaurant={restaurant}
          onClose={modalCb}
        />
      )}
      <Flex justifyContent={"center"}>
        <Heading as="h1" size="4xl" fontSize="24px" paddingBottom={"20px"}>
          {restaurant.name} scheduled reservations
        </Heading>
      </Flex>
      <Flex justifyContent={"center"}>
        <Button
          marginTop={"15px"}
          maxW={"380px"}
          mt={8}
          p={4}
          bg={"black"}
          color={"white"}
          rounded={"md"}
          _hover={{
            bg: "blackAlpha.200",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          onClick={() => setAddModalIsOpen(true)}
        >
          Add a Reservation
        </Button>
      </Flex>
      {tableReservations && (
        <ThemeContextProvider>
          <Paper>
            <Scheduler
              data={
                currentTable === all
                  ? tableReservations
                  : tableReservations.filter((r) => r.tableId === currentTable)
              }
            >
              <ViewState
                defaultCurrentViewName="Week"
                currentDate={currentDate}
                onCurrentDateChange={setCurrentDate}
              />
              <GroupingState grouping={grouping} />
              <EditingState onCommitChanges={commitChanges} />
              <IntegratedEditing />
              <DayView />
              <WeekView />
              <ConfirmationDialog />
              <Appointments />
              <Resources data={resources} palette={[]} />
              <IntegratedGrouping />
              <GroupingPanel cellComponent={GroupingPanel.Cell} />
              <Toolbar flexibleSpaceComponent={flexibleSpace} />
              <DateNavigator />
              <ViewSwitcher />
              <TodayButton />
              <AppointmentTooltip
                showCloseButton
                showDeleteButton
                contentComponent={Content}
              />
            </Scheduler>
          </Paper>
        </ThemeContextProvider>
      )}
    </>
  );
};

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const theme = createTheme({
    palette: {},
    typography: {
      fontFamily: [
        "NotoSans",
        "NotoSansThai",
        "Arial",
        "Roboto",
        "'Helvetica Neue'",
        "sans-serif",
      ].join(","),
    },
    shape: {
      borderRadius: 15,
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

type Props = {
  userData: Identity;
  tableId?: string;
};

const TableReservations = ({ userData, tableId }: Props) => {
  const { getTables, getRestaurant } = useContext(ApiContext);
  const [tables, setTable] = useState<Table[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    Promise.all([
      getTables(userData.restaurantOrigin).then((tables) => {
        setTable(tables);
      }),
      getRestaurant(userData.restaurantOrigin).then((restaurant) =>
        setRestaurant(restaurant)
      ),
    ]);
  }, [getRestaurant, getTables, userData.restaurantOrigin]);

  return restaurant && tables.length ? (
    <Schedule
      userData={userData}
      tables={tables}
      restaurant={restaurant}
      tableId={tableId}
    />
  ) : null;
};

export default TableReservations;
