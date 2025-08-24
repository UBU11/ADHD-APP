export default getAssignments = (req, res) => {
 
  const mockAssignments = [
    { id: 1, title: "History Essay", dueDate: "2023-10-27" },
    { id: 2, title: "Calculus Problem Set", dueDate: "2023-10-29" },
  ];
  res.json(mockAssignments);
};
