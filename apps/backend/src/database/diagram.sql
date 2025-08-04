DROP TABLE IF EXISTS "participants";
DROP TABLE IF EXISTS "contributions";
DROP TABLE IF EXISTS "circuits";
DROP TABLE IF EXISTS "ceremonies";
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "displayName" VARCHAR NOT NULL,
  "creationTime" INTEGER NOT NULL,
  "lastSignInTime" INTEGER,
  "lastUpdated" INTEGER,
  "avatarUrl" VARCHAR,
  "provider" TEXT CHECK("provider" IN ('GITHUB', 'ETH')) NOT NULL DEFAULT 'GITHUB'
);

CREATE TABLE "projects" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR NOT NULL,
  "contact" VARCHAR NOT NULL,
  "coordinatorId" INTEGER NOT NULL,
  FOREIGN KEY ("coordinatorId") REFERENCES "users" ("id")
);

CREATE TABLE "ceremonies" (
  "projectId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "description" VARCHAR,
  "type" TEXT CHECK("type" IN ('PHASE1', 'PHASE2')) NOT NULL DEFAULT 'PHASE2',
  "state" TEXT CHECK("state" IN ('SCHEDULED', 'OPENED', 'PAUSED', 'CLOSED', 'CANCELED', 'FINALIZED')) NOT NULL DEFAULT 'SCHEDULED',
  "start_date" INTEGER NOT NULL,
  "end_date" INTEGER NOT NULL,
  "penalty" INTEGER NOT NULL,
  "authProviders" JSON NOT NULL,
  FOREIGN KEY ("projectId") REFERENCES "projects" ("id")
);

CREATE TABLE "circuits" (
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR NOT NULL,
  "timeoutMechanismType" TEXT CHECK("timeoutMechanismType" IN ('DYNAMIC', 'FIXED', 'LOBBY')) NOT NULL DEFAULT 'FIXED',
  "dynamicThreshold" INTEGER,
  "fixedTimeWindow" INTEGER,
  "sequencePosition" INTEGER NOT NULL,
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
  "files" JSON,
  FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id")
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
  "beacon" JSON,
  FOREIGN KEY ("circuitId") REFERENCES "circuits" ("id"),
  FOREIGN KEY ("participantId") REFERENCES "participants" ("id")
);

CREATE TABLE "participants" (
  "userId" INTEGER NOT NULL,
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "status" TEXT CHECK("status" IN ('CREATED', 'WAITING', 'READY', 'CONTRIBUTING', 'CONTRIBUTED', 'DONE', 'FINALIZING', 'FINALIZED', 'TIMEDOUT', 'EXHUMED')) NOT NULL DEFAULT 'CREATED',
  "contributionStep" TEXT CHECK("contributionStep" IN ('DOWNLOADING', 'COMPUTING', 'UPLOADING', 'VERIFYING', 'COMPLETED')) NOT NULL,
  "contributionProgress" INTEGER,
  "contributionStartedAt" INTEGER,
  "verificationStartedAt" INTEGER,
  "tempContributionData" JSON,
  "timeout" JSON,
  FOREIGN KEY ("userId") REFERENCES "users" ("id"),
  FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id")
);