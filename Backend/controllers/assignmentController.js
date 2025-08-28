const getAssignments = (req, res) => {
  console.log("--- getAssignments controller reached! ---");
  const mockAssignments = [
    { id: 1, title: "History Essay", dueDate: "2023-10-27" },
    { id: 2, title: "Calculus Problem Set", dueDate: "2023-10-29" },
  ];

  console.log("Sending mock assignments as JSON response.");
  res.json(mockAssignments);
};

export default getAssignments;
