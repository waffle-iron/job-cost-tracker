var nconf = require("nconf");

nconf
  .argv()
  .env()
  .file({
    file: '.env' // relative to root
  })
  .defaults({
    SESSION_SECRET: "I_AM_THE_BEST_SECRET_JOBTRACKER_isodi&cndoic12n",
    DATABASE_URL: "mongodb://localhost/jobcosttracker",
    AUTH0_DOMAIN: "bitovi1.auth0.com",
    AUTH0_CLIENT_ID: "KoQGeIILgDGcPhczv27rVmr2UNCWcN1P"
    /* don't put clientSecret in version control */
  });

export default {
    connections: {
        mongodb: {
            connectionString: nconf.get("DATABASE_URL")
        }
    },
    sessionSecret: nconf.get("SESSION_SECRET"),
    auth0: {
      domain: nconf.get("AUTH0_DOMAIN"),
      clientID: nconf.get("AUTH0_CLIENT_ID"),
      clientSecret: nconf.get("AUTH0_CLIENT_SECRET"),
      apiToken: nconf.get("AUTH0_API_TOKEN")
    },
    clientRoutes: [
        "/",
        "/tasks",
        "/task-day",
        "/reports",
        "/new-lot",
        "/new-task-day",
        "/custom-work-order",
        "/data-cleanup",
        "/manage-users"
    ]
};
