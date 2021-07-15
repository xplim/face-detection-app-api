let allowedDomainsArray = [];

try {
  const allowedDomainsVar = JSON.parse(process.env.ALLOWED_DOMAINS ?? '');

  if (Array.isArray(allowedDomainsVar)) {
    allowedDomainsArray = allowedDomainsVar;
  } else {
    throw new Error(
      'ALLOWED_DOMAINS environment variable is undefined or does not meet expected format.' +
        '\nExpected format:' +
        '\n    ["https://example-123.com", "https://example-456.com"]'
    );
  }
} catch (err) {
  console.error(err);
}

export const corsOptions = {
  origin: (origin, callback) => {
    if (
      allowedDomainsArray.indexOf(origin) !== -1 ||
      (process.env.NODE_ENV === 'development' && !origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS.'));
    }
  },
};

export const dbConnectionOptions = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
