export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING as string,
};

export const EMAIL_CONFIGURATION = {
  email: process.env.EMAIL as string,
  emailPassword: process.env.EMAIL_PASSWORD as string,
};

export const RMQ_CONFIGURATION = {
  connectionString: process.env.RABBITMQ_CONNECTION_STRING as string,
  exchange: process.env.RABBITMQ_EXCHANGE as string,
};
