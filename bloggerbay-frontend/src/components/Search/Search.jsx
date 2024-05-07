import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import List from "@mui/joy/List";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/joy/ListItem";
import { Typography, TextField } from "@mui/material";

function RealTimeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [layout, setLayout] = React.useState(undefined);
  const [scroll, setScroll] = React.useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() !== "") {
        try {
          const searchResults = await fetchSearchedTexts(searchTerm);
          console.log("search", searchResults);
          setSearchResults(searchResults);
          searchResults.length > 0 && setLayout("center");
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]); // Clear search results if search term is empty
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const fetchSearchedTexts = async (searchedText) => {
    const response = await axios.post("http://localhost:8888/search", {
      title: searchedText,
    });
    console.log(response.data);
    if (response.data.status === 200) {
      return response.data.blogs;
    } else {
      return [];
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <TextField
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search by title..."
        size="small"
        sx={{
          backgroundColor: "white",
        }}
      />
      <React.Fragment>
        <Stack direction="row" spacing={1}></Stack>
        <Modal
          open={!!layout && searchResults.length > 0}
          onClose={() => {
            setLayout(undefined);
          }}
        >
          <ModalDialog layout={layout}>
            <ModalClose />
            <DialogTitle>Search Results:</DialogTitle>
            <List
              sx={{
                overflow: scroll ? "scroll" : "initial",
                mx: "calc(-1 * var(--ModalDialog-padding))",
                px: "var(--ModalDialog-padding)",
                listStyleType: "disc",
              }}
            >
              {searchResults.map((item, index) => (
                <ListItem key={index} sx={{ display: "list-item" }}>
                  <Typography variant="h5" fontWeight={500} gutterBottom>
                    {`Title: ${item.title}`}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {`Category: ${item.category}`}
                  </Typography>
                  <Typography variant="body1">{item.description}</Typography>
                </ListItem>
              ))}
            </List>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    </div>
  );
}

export default RealTimeSearch;
