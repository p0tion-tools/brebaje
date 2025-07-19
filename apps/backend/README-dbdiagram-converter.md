# DbDiagram.io to SQL DDL Converter

A TypeScript script that converts dbdiagram.io schema definitions to standard SQL DDL statements.

## Features

- ✅ Parse dbdiagram.io syntax
- ✅ Convert ENUM types to PostgreSQL-style ENUMs
- ✅ Handle table definitions with columns and constraints
- ✅ Parse foreign key relationships
- ✅ Support for comments and constraints
- ✅ Type normalization (e.g., `int` → `INTEGER`)
- ✅ Generate standard SQL DDL output

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure you have TypeScript and ts-node installed globally (or use npx):
```bash
npm install -g typescript ts-node
```

## Usage

### Command Line

```bash
# Basic usage
ts-node dbdiagram-to-sql.ts input.dbml

# Specify output file
ts-node dbdiagram-to-sql.ts input.dbml output.sql

# Using npm script
npm run convert input.dbml output.sql
```

### Programmatic Usage

```typescript
import { DbDiagramToSQL } from './dbdiagram-to-sql';

const converter = new DbDiagramToSQL();
const sql = converter.parse(dbDiagramCode);
console.log(sql);
```

## Supported Syntax

### ENUM Types
```dbml
Enum UserStatus {
  'ACTIVE'
  'INACTIVE'
  'SUSPENDED'
}
```

### Tables
```dbml
Table users {
  id int [pk, increment] // Primary key
  username varchar(50) [unique, not null] // Unique username
  email varchar(255) [unique, not null] // User email
  status UserStatus [default: 'ACTIVE'] // User status
}
```

### Foreign Keys
```dbml
// Inline reference
user_id int [ref: > users.id]

// Separate reference
profiles.user_id > ref users.id [onDelete: CASCADE]
```

### Supported Constraints
- `pk` - Primary Key
- `increment` - Auto Increment
- `unique` - Unique constraint
- `not null` - NOT NULL constraint
- `null` - NULL constraint
- `default: value` - Default value
- `ref: > table.column` - Foreign key reference

### Supported Data Types
- `int`, `integer` → `INTEGER`
- `bigint` → `BIGINT`
- `varchar(n)` → `VARCHAR(n)`
- `text` → `TEXT`
- `boolean`, `bool` → `BOOLEAN`
- `decimal(p,s)` → `DECIMAL(p,s)`
- `timestamp` → `TIMESTAMP`
- `date` → `DATE`
- `json` → `JSON`
- And many more...

## Example

### Input (sample-schema.dbml)
```dbml
Enum UserStatus {
  'ACTIVE'
  'INACTIVE'
  'SUSPENDED'
}

Table users {
  id int [pk, increment]
  username varchar(50) [unique, not null]
  email varchar(255) [unique, not null]
  status UserStatus [default: 'ACTIVE']
}

Table profiles {
  id int [pk, increment]
  user_id int [not null]
  first_name varchar(100)
}

profiles.user_id > ref users.id [onDelete: CASCADE]
```

### Output (SQL)
```sql
CREATE TYPE "UserStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED'
);

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "status" UserStatus DEFAULT 'ACTIVE'
);

CREATE TABLE "profiles" (
  "id" INTEGER PRIMARY KEY AUTO_INCREMENT,
  "user_id" INTEGER NOT NULL
);

ALTER TABLE "profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
```

## Testing

Run the test with the sample schema:
```bash
npm test
```

This will convert `sample-schema.dbml` to `output.sql`.

## Limitations

- Indexes are not yet fully supported
- Some advanced dbdiagram.io features may not be parsed
- The converter focuses on standard SQL DDL compatibility

## Contributing

Feel free to extend the parser to support additional dbdiagram.io features or improve the SQL output format. 