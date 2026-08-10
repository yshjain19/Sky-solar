/**
 * Wraps async Express handlers to catch errors and forward them to the global error handler
 * @param {Function} fn Async controller function
 * @returns {Function} Express route middleware
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
