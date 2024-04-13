const response = (
  res: any,
  status: number,
  message: string,
  data: any,
  ok: boolean
) => {
  res.status(status).json({
    message: message,
    data: data,
    ok: ok,
  });
};

export default response;
