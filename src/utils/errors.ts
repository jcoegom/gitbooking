export const handleError = (error: unknown) => {
  //You can do whatever you need. (Send error to third party..etc.)
  if (error instanceof Error) {
    console.log(error.message);
    return;
  }
  console.log(JSON.stringify(error)); //TODO: Could appear circular referencia. It is an example
};
