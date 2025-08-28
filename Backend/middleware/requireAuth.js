const requireAuth = () => {
  try {
    (req, res, next) => {
       console.log("--- requireAuth middleware triggered ---");
      if (!req.isAuthenticated()) {
        console.log("User is NOT authenticated. Sending 401 error.");
        return res.status(401).send({ error: "You must be logged in." });
      }
      console.log("User IS authenticated. Proceeding...");
     return next();
    };
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    res.status(500).send({ error: "Internal server error." });
  }
};
export default requireAuth;
