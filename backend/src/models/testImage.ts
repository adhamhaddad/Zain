import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type TestImageType = {
  id?: number;
  test_id: number;
  image_url: string;
};
class TestImage {
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
  async createTestImages(
    connection: PoolClient,
    ti: TestImageType
  ): Promise<TestImageType> {
    const query = {
      text: 'INSERT INTO test_images (test_id, image_url) VALUES ($1, $2) RETURNING *',
      values: [ti.test_id, ti.image_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default TestImage;
