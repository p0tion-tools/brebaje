CREATE TYPE "ceremonyState" AS ENUM (
  'SCHEDULED',
  'OPENED',
  'PAUSED',
  'CLOSED',
  'CANCELED',
  'FINALIZED'
);

CREATE TYPE "ceremonyType" AS ENUM (
  'PHASE1',
  'PHASE2'
);

CREATE TYPE "circuitTimeoutType" AS ENUM (
  'DYNAMIC',
  'FIXED',
  'LOBBY'
);

CREATE TYPE "participantStatus" AS ENUM (
  'CREATED',
  'WAITING',
  'READY',
  'CONTRIBUTING',
  'CONTRIBUTED',
  'DONE',
  'FINALIZING',
  'FINALIZED',
  'TIMEDOUT',
  'EXHUMED'
);

CREATE TYPE "participantContributionStep" AS ENUM (
  'DOWNLOADING',
  'COMPUTING',
  'UPLOADING',
  'VERIFYING',
  'COMPLETED'
);

CREATE TABLE "projects" (
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "name" VARCHAR,
  "contact" VARCHAR,
  "coordinatorId" INTEGER NOT NULL
);

CREATE TABLE "ceremonies" (
  "projectId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "description" VARCHAR,
  "state" CEREMONYSTATE DEFAULT 'SCHEDULED',
  "start_date" INTEGER,
  "end_date" INTEGER,
  "penalty" INTEGER,
  "authProviders" JSON
);

CREATE TABLE "circuits" (
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "name" VARCHAR,
  "timeoutMechanismType" CIRCUITTIMEOUTTYPE DEFAULT 'FIXED',
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
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "contributionComputationTime" INTEGER,
  "fullContributionTime" INTEGER,
  "verifyContributionTime" INTEGER,
  "zkeyIndex" INTEGER,
  "valid" BOOLEAN,
  "lastUpdated" INTEGER,
  "files" JSON,
  "verificationSofware" JSON,
  "beacon" JSON
);

CREATE TABLE "participants" (
  "userId" INTEGER NOT NULL,
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "status" PARTICIPANTSTATUS DEFAULT 'CREATED',
  "contributionStep" PARTICIPANTCONTRIBUTIONSTEP,
  "contributionProgress" INTEGER,
  "contributionStartedAt" INTEGER,
  "verificationStartedAt" INTEGER,
  "tempContributionData" JSON,
  "timeout" JSON
);

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
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