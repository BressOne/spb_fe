"use client";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";
import { Table } from "@/contexts/api";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";
import { TableFilter, TableChange } from "./types";

export const FlexibleSpace = ({
  table,
  tableChange,
  tables,
  ...restProps
}: {
  table: TableFilter;
  tables: Table[];
  tableChange: TableChange;
}) => (
  <Toolbar.FlexibleSpace {...restProps}>
    <FormControl>
      <InputLabel id="demo-simple-select-label">Table Filter</InputLabel>
      <Select
        sx={{ height: "43px", marginRight: "10px", minWidth: "150px" }}
        value={table}
        label="filter"
        onChange={(e) => tableChange(e.target.value)}
      >
        <MenuItem value={"All"}>{"All"}</MenuItem>
        {tables.map((t) => {
          return (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  </Toolbar.FlexibleSpace>
);
