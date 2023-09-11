import { PoolClient } from 'pg';
import { pgClient } from '../database';
import SubmitionImage, { SubmitionImageType } from './submitionImage';

export type TestSubmitionType = {
  id?: number;
  user_id: number;
  test_id: number;
  images: string[];
  created_at?: Date;
};
class TestSubmition {
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
  async withTransaction<T>(
    connection: PoolClient,
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      await connection.query('BEGIN');
      const result = await callback();
      await connection.query('COMMIT');
      return result;
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
  }
  async createTestSubmition(ts: TestSubmitionType): Promise<TestSubmitionType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        const query = {
          text: 'INSERT INTO tests_submitions (user_id, test_id) VALUES ($1, $2) RETURNING *',
          values: [ts.user_id, ts.test_id]
        };
        const result = await connection.query(query);
        const { id: submition_id } = result.rows[0];

        // Test Image Query
        const testImage = new SubmitionImage();
        const image_urls: SubmitionImageType[] = [];

        if (ts.images.length) {
          for (let image of ts.images) {
            const result = await testImage.createSubmitionImages(connection, {
              submition_id,
              image_url: image
            });
            image_urls.push(result);
          }
        }
        return { ...result.rows[0], submition_images: image_urls };
      });
    });
  }
  async getTestSubmitions(test_id: number): Promise<TestSubmitionType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT ts.*, array_agg(si.image_url) AS submition_images
        FROM tests_submitions ts
        LEFT JOIN submition_images si ON si.test_id = ts.id
        WHERE ts.test_id = $1
        GROUP BY ts.id
        `,
        values: [test_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getTestSubmition(id: number): Promise<TestSubmitionType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT ts.*, array_agg(si.image_url) AS submition_images
        FROM tests_submitions ts
        LEFT JOIN submition_images si ON si.test_id = ts.id
        WHERE ts.id = $1
        GROUP BY ts.id
        `,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteTestSubmition(id: number): Promise<TestSubmitionType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM tests_submitions WHERE id=$1 RETURNING *',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default TestSubmition;
