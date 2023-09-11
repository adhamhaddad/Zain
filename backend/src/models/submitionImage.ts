import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type SubmitionImageType = {
  id?: number;
  submition_id: number;
  image_url: string;
};
class SubmitionImage {
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
  async createSubmitionImages(
    connection: PoolClient,
    si: SubmitionImageType
  ): Promise<SubmitionImageType> {
    const query = {
      text: 'INSERT INTO submition_images (submition_id, image_url) VALUES ($1, $2) RETURNING *',
      values: [si.submition_id, si.image_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default SubmitionImage;
