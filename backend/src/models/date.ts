import { PoolClient } from 'pg';

export type DateType = {
  id: number;
  start_date: Date;
  end_date?: Date;
};
class Date {
  async createDate(connection: PoolClient, d: DateType): Promise<DateType> {
    const query = {
      text: 'INSERT INTO dates (start_date, end_date) VALUES ($1, $2) RETURNING *',
      values: [d.start_date, d.end_date]
    };
    const result = await connection.query(query);
    return result.rows[0].id;
  }
  async updateDate(connection: PoolClient, d: DateType): Promise<DateType> {
    const query = {
      text: `UPDATE dates SET start_date=$2, end_date=$3 WHERE id=$1 RETURNING *`,
      values: [d.id, d.start_date, d.end_date]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async deleteDate(connection: PoolClient, id: number): Promise<DateType> {
    const query = {
      text: 'DELETE FROM dates WHERE id=$1 RETURNING id',
      values: [id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default Date;
