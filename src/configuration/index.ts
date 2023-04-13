export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING as string,
};

export const EMAIL_CONFIGURATION = {
  email: process.env.EMAIL as string,
  emailPassword: process.env.EMAIL_PASSWORD as string,
};

export const rabbitMQConfiguration = {
  rabbitMQConnectionString: process.env.RABBITMQ_CONNECTION_STRING as string,
};
