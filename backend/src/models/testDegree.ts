import { PoolClient } from 'pg';
import { pgClient } from '../database';
import TestImage, { TestImageType } from './testImage';

export type TestDegreeType = {
  id?: number;
  user_id: number;
  test_id: number;
  degree: number;
  created_at?: Date;
};
class Test {
  async withConnection<T>(
    callback: (connection: PoolClient) => Promise<T>
  ): Promise<T> {
    const connection = await pgClient.connect();
    try {
      return await callback(connection);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async createTestDegree(td: TestDegreeType): Promise<TestDegreeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO tests_degree (user_id, test_id, degree) VALUES ($1, $2, $3) RETURNING *',
        values: [td.user_id, td.test_id, td.degree]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getTestDegree(id: number): Promise<TestDegreeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT degree FROM tests_degree WHERE id=$1',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateTestDegree(
    id: number,
    t: TestDegreeType
  ): Promise<TestDegreeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'UPDATE tests_degree SET degree=$3 WHERE id=$1 AND test_id=$2 RETURNING *',
        values: [id, t.test_id, t.degree]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Test;
