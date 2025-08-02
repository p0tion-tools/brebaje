import { convertDbmlToSql } from './dbml-to-sql';

export function setUpDatabase() {
  const sql = convertDbmlToSql('./diagram.dbml');
  // TODO: add the sql to the database
  console.log(sql);
  // TODO: use sequelize-auto to transform database to models
}
