class forbiddenError extends Error {
  constructor(message) {
    super(message);

    this.status = 403;
  }
}

module.exports = forbiddenError;
