-- SQLite3 version of the database schema
-- Note: SQLite3 doesn't support ENUM types, so we'll use TEXT with CHECK constraints

CREATE TABLE "projects" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "contact" TEXT,
  "coordinatorId" INTEGER NOT NULL
);

CREATE TABLE "ceremonies" (
  "projectId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "description" TEXT,
  "state" TEXT CHECK (state IN ('SCHEDULED', 'OPENED', 'PAUSED', 'CLOSED', 'CANCELED', 'FINALIZED')),
  "start_date" INTEGER,
  "end_date" INTEGER,
  "penalty" INTEGER,
  "authProviders" TEXT -- JSON stored as TEXT in SQLite
);

CREATE TABLE "circuits" (
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "timeoutMechanismType" TEXT CHECK (timeoutMechanismType IN ('DYNAMIC', 'FIXED', 'LOBBY')),
  "dynamicThreshold" INTEGER,
  "fixedTimeWindow" INTEGER,
  "sequencePosition" INTEGER,
  "zKeySizeInBytes" INTEGER,
  "constraints" INTEGER,
  "pot" INTEGER,
  "averageContributionComputationTime" INTEGER,
  "averageFullContributionTime" INTEGER,
  "averageVerifyContributionTime" INTEGER,
  "compiler" TEXT, -- JSON stored as TEXT in SQLite
  "template" TEXT, -- JSON stored as TEXT in SQLite
  "verification" TEXT, -- JSON stored as TEXT in SQLite
  "artifacts" TEXT, -- JSON stored as TEXT in SQLite
  "metadata" TEXT, -- JSON stored as TEXT in SQLite
  "files" TEXT -- JSON stored as TEXT in SQLite
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
  "files" TEXT, -- JSON stored as TEXT in SQLite
  "verificationSofware" TEXT, -- JSON stored as TEXT in SQLite
  "beacon" TEXT -- JSON stored as TEXT in SQLite
);

CREATE TABLE "participants" (
  "userId" INTEGER NOT NULL,
  "ceremonyId" INTEGER NOT NULL,
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "status" TEXT CHECK (status IN ('CREATED', 'WAITING', 'READY', 'CONTRIBUTING', 'CONTRIBUTED', 'DONE', 'FINALIZING', 'FINALIZED', 'TIMEDOUT', 'EXHUMED')),
  "contributionStep" TEXT CHECK (contributionStep IN ('DOWNLOADING', 'COMPUTING', 'UPLOADING', 'VERIFYING', 'COMPLETED')),
  "contributionProgress" INTEGER,
  "contributionStartedAt" INTEGER,
  "verificationStartedAt" INTEGER,
  "tempContributionData" TEXT, -- JSON stored as TEXT in SQLite
  "timeout" TEXT -- JSON stored as TEXT in SQLite
);

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "displayName" TEXT,
  "creationTime" INTEGER,
  "lastSignInTime" INTEGER,
  "lastUpdated" INTEGER,
  "avatarUrl" INTEGER,
  "provider" TEXT
);

-- Add foreign key constraints
-- Note: SQLite3 requires foreign keys to be enabled with PRAGMA foreign_keys = ON;

ALTER TABLE "projects" ADD FOREIGN KEY ("coordinatorId") REFERENCES "users" ("id");
ALTER TABLE "ceremonies" ADD FOREIGN KEY ("projectId") REFERENCES "projects" ("id");
ALTER TABLE "circuits" ADD FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id");
ALTER TABLE "contributions" ADD FOREIGN KEY ("circuitId") REFERENCES "circuits" ("id");
ALTER TABLE "contributions" ADD FOREIGN KEY ("participantId") REFERENCES "participants" ("id");
ALTER TABLE "participants" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
ALTER TABLE "participants" ADD FOREIGN KEY ("ceremonyId") REFERENCES "ceremonies" ("id");

-- Create indexes for better performance
CREATE INDEX idx_projects_coordinator ON projects(coordinatorId);
CREATE INDEX idx_ceremonies_project ON ceremonies(projectId);
CREATE INDEX idx_circuits_ceremony ON circuits(ceremonyId);
CREATE INDEX idx_contributions_circuit ON contributions(circuitId);
CREATE INDEX idx_contributions_participant ON contributions(participantId);
CREATE INDEX idx_participants_user ON participants(userId);
CREATE INDEX idx_participants_ceremony ON participants(ceremonyId); 