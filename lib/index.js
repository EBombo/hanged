// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const initMiddleware = (middleware) => (req, res) =>
  new Promise((resolve, reject) =>
    middleware(req, res, (result) => {
      if (result instanceof Error) return reject(result);

      return resolve(result);
    })
  );

export default initMiddleware;
