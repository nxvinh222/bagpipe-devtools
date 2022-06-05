function responseSuccess(res, data) {
  res.status(200).send({
    msg: "success",
    data: data,
  });
}

module.exports = responseSuccess;
