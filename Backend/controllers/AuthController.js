const googleCallback = (req, res) => {
  res.redirect("http://localhost:3000/dashboard");
};

const logout = (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000/");
};

const getCurrentUser = (req, res) => {
  res.send(req.user);
};

export default {
  googleCallback,
  logout,
  getCurrentUser,
};
