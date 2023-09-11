import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type PostCommentType = {
  id: number;
  user_id: number;
  post_id: number;
  comment: number;
  created_at?: Date;
  update_at?: Date;
};
class PostComment {
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
  async createPostComment(pc: PostCommentType): Promise<PostCommentType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO post_comments (user_id, post_id, comment) VALUES ($1, $2, $3) RETURNING *',
        values: [pc.user_id, pc.post_id, pc.comment]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updatePostComment(
    id: number,
    pc: PostCommentType
  ): Promise<PostCommentType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE post_comments SET comment=$3 WHERE id=$1 AND user_id=$2 RETURNING *`,
        values: [id, pc.user_id, pc.comment]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deletePostComment(
    id: number,
    user_id: number
  ): Promise<PostCommentType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM post_comments WHERE id=$1 AND user_id=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default PostComment;
