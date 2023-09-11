import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type PostVideoType = {
  id: number;
  post_id: number;
  video_url: string;
};
class PostVideo {
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
  async createPostVideo(
    connection: PoolClient,
    pv: PostVideoType
  ): Promise<PostVideoType> {
    const query = {
      text: 'INSERT INTO post_videos (post_id, video_url) VALUES ($1, $2) RETURNING *',
      values: [pv.post_id, pv.video_url]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async deletePostVideo(
    connection: PoolClient,
    post_id: number
  ): Promise<PostVideoType> {
    const query = {
      text: 'DELETE FROM post_videos WHERE post_id=$1 RETURNING id',
      values: [post_id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
}
export default PostVideo;
