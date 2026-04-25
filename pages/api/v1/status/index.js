function status(request, response) {
  response.status(200).json({ status: "Jônata" });
}

export default status;