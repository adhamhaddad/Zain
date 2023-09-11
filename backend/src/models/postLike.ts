import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type PostLikeType = {
  id: number;
  user_id: number;
  post_id: number;
  created_at?: Date;
};
class PostLike {
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
  async createPostLike(pl: PostLikeType): Promise<PostLikeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) RETURNING *',
        values: [pl.user_id, pl.post_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deletePostLike(id: number, user_id: number): Promise<PostLikeType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM post_likes WHERE id=$1 AND user_id=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default PostLike;
