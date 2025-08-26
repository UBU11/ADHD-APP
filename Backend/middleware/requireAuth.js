const requireAuth = () => {
  try {
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).send({ error: "You must be logged in." });
      }
      next();
    };
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    res.status(500).send({ error: "Internal server error." });
  }
};
export default requireAuth;
