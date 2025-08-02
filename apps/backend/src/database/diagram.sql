DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "participants";
DROP TABLE IF EXISTS "contributions";
DROP TABLE IF EXISTS "circuits";
DROP TABLE IF EXISTS "ceremonies";
DROP TABLE IF EXISTS "projects";

CREATE TABLE "projects" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR,
  "contact" VARCHAR,
  "coordinatorId" INTEGER NOT NULL
);

CREATE TABLE "ceremonies" (
  "projectId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "description" VARCHAR,
  "state" TEXT CHECK("state" IN ('SCHEDULED', 'OPENED', 'PAUSED', 'CLOSED', 'CANCELED', 'FINALIZED')) DEFAULT 'SCHEDULED',
  "start_date" INTEGER,
  "end_date" INTEGER,
  "penalty" INTEGER,
  "authProviders" JSON
);

CREATE TABLE "circuits" (
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR,
  "timeoutMechanismType" TEXT CHECK("timeoutMechanismType" IN ('DYNAMIC', 'FIXED', 'LOBBY')) DEFAULT 'FIXED',
  "dynamicThreshold" INTEGER,
  "fixedTimeWindow" INTEGER,
  "sequencePosition" INTEGER,
  "zKeySizeInBytes" INTEGER,
  "constraints" INTEGER,
  "pot" INTEGER,
  "averageContributionComputationTime" INTEGER,
  "averageFullContributionTime" INTEGER,
  "averageVerifyContributionTime" INTEGER,
  "compiler" JSON,
  "template" JSON,
  "verification" JSON,
  "artifacts" JSON,
  "metadata" JSON,
  "files" JSON
);

CREATE TABLE "contributions" (
  "circuitId" INTEGER NOT NULL,
  "participantId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "contributionComputationTime" INTEGER,
  "fullContributionTime" INTEGER,
  "verifyContributionTime" INTEGER,
  "zkeyIndex" INTEGER,
  "valid" BOOLEAN,
  "lastUpdated" INTEGER,
  "files" JSON,
  "verificationSoftware" JSON,
  "beacon" JSON
);

CREATE TABLE "participants" (
  "userId" INTEGER NOT NULL,
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "status" TEXT CHECK("status" IN ('CREATED', 'WAITING', 'READY', 'CONTRIBUTING', 'CONTRIBUTED', 'DONE', 'FINALIZING', 'FINALIZED', 'TIMEDOUT', 'EXHUMED')) DEFAULT 'CREATED',
  "contributionStep" TEXT CHECK("contributionStep" IN ('DOWNLOADING', 'COMPUTING', 'UPLOADING', 'VERIFYING', 'COMPLETED')),
  "contributionProgress" INTEGER,
  "contributionStartedAt" INTEGER,
  "verificationStartedAt" INTEGER,
  "tempContributionData" JSON,
  "timeout" JSON
);

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "displayName" VARCHAR,
  "creationTime" INTEGER,
  "lastSignInTime" INTEGER,
  "lastUpdated" INTEGER,
  "avatarUrl" INTEGER,
  "provider" VARCHAR
);

ALTER TABLE "projects" ADD FOREIGN KEY ("coordinatorId") REFERENCES "users" ("id");
ALTER TABLE "ceremonies" ADD FOREIGN KEY ("projectId") REFERENCES "projects" ("id");
ALTER TABLE "circuits" ADD FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id");
ALTER TABLE "contributions" ADD FOREIGN KEY ("circuitId") REFERENCES "circuits" ("id");
ALTER TABLE "contributions" ADD FOREIGN KEY ("participantId") REFERENCES "participants" ("id");
ALTER TABLE "participants" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
ALTER TABLE "participants" ADD FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id");