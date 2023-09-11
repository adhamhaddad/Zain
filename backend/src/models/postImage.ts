import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type PostImageType = {
  id: number;
  post_id: number;
  image_url: string;
};
class PostImage {
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
  async createPostImage(
    connection: PoolClient,
    pi: PostImageType
  ): Promise<PostImageType> {
    const query = {
      text: 'INSERT INTO post_images (post_id, image_url) VALUES ($1, $2) RETURNING *',
      values: [pi.post_id, pi.image_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async deletePostImage(
    connection: PoolClient,
    post_id: number
  ): Promise<PostImageType> {
    const query = {
      text: 'DELETE FROM post_images WHERE post_id=$1 RETURNING id',
      values: [post_id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default PostImage;
