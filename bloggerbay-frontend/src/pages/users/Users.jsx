import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const columns = [
  {
    id: 1,
    name: "Username",
  },
  {
    id: 2,
    name: "Role",
  },
  {
    id: 3,
    name: "Action",
  },
];

const rows = [
  {
    username: "Dexter.Rippin",
    role: "Manager",
    action: "Update",
  },
  {
    username: "Mariah91",
    role: "User",
    action: "Read",
  },

  {
    username: "Alysa_Schiller",
    role: "User",
    action: "Create",
  },
  {
    username: "Alysa_Schiller",
    role: "User",
    action: "Create",
  },
  {
    username: "Ansel40",
    role: "Admin",
    action: "Delete",
  },
  {
    username: "Janae.Tremblay",
    role: "User",
    action: "Read",
  },
];

const UsersPage = (props) => {
  const [userData, setUserData] = useState([]);

  const fetchUsers = () => {
    return fetch("http://localhost:8888/users")
      .then((res) => res.json())
      .then((d) => setUserData(d.filter((user) => user.role !== "admin")));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user_id) => {
    const selectedIndex =
      userData.findIndex((user) => user.user_id === user_id) ?? -1;
    if (selectedIndex == -1) {
      alert("User disabling failed");
    }
    userData[selectedIndex].isDisabled = true;
    setUserData(userData);
    const response = await axios.post("http://localhost:8888/disableuser", {
      user_id,
      user_name: localStorage.getItem("username"),
    });
    if (response.status == 200) {
      alert("User disabled successfully");
      window.location.reload();
    }
  };

  const [rowperpage, rowperpagechange] = useState(5);
  const [page, pagechange] = useState(0);
  const handlepagechange = (event, newpage) => {
    pagechange(newpage);
  };
  const handlerowperpagechange = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };
  return (
    <div style={{ margin: "1%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "midnightblue" }}>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ color: "white" }}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        window.alert("This feature is still not available");
                      }}
                      variant="contained"
                      color="primary"
                      disabled={!row.isDisabled}
                    >
                      Enable
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={!!row.isDisabled}
                      onClick={() => handleDelete(row.user_id)}
                    >
                      Disable
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 20]}
        rowsPerPage={rowperpage}
        page={page}
        count={rows.length}
        component={"div"}
        onPageChange={handlepagechange}
        onRowsPerPageChange={handlerowperpagechange}
      ></TablePagination>
    </div>
  );
};

export default UsersPage;
