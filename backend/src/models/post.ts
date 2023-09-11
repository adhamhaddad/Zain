import { PoolClient } from 'pg';
import { pgClient } from '../database';
import PostVideo from './postVideo';
import PostImage from './postImage';

export type PostType = {
  id: number;
  post_caption: string;
  post_images: string[];
  post_videos: string[];
  user_id: number;
  group_id?: number;
  created_at?: Date;
  update_at?: Date;
};
class Post {
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
  async createPost(p: PostType): Promise<PostType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        // Post
        const query = {
          text: `
            INSERT INTO posts (post_caption, user_id, group_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
          values: [p.post_caption, p.user_id, p.group_id]
        };
        // Post Images
        const postImage = new PostImage();

        // Post Videos
        const postVideo = new PostVideo();

        const result = await connection.query(query);
        return result.rows[0];
      });
    });
  }
  async getPosts(group_id: number): Promise<PostType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT
            p.id AS post_id,
            p.caption AS post_caption,
            ARRAY_AGG(DISTINCT pi.image_url) AS post_images,
            ARRAY_AGG(DISTINCT pv.video_url) AS post_videos,
            ARRAY_AGG(DISTINCT pl.user_id) AS likes,
            ARRAY_AGG(DISTINCT pc.comment_text) AS comments
        FROM posts p
        LEFT JOIN post_images pi ON pi.post_id = p.id
        LEFT JOIN post_videos pv ON pv.post_id = p.id
        LEFT JOIN post_likes pl ON pl.post_id = p.id
        LEFT JOIN post_comments pc ON pc.post_id = p.id
        WHERE p.group_id = $1
        GROUP BY p.id, p.caption
        `,
        values: [group_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getPost(id: number): Promise<PostType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT
            p.caption AS post_caption,
            ARRAY_AGG(DISTINCT pi.image_url) AS post_images,
            ARRAY_AGG(DISTINCT pv.video_url) AS post_videos,
            ARRAY_AGG(DISTINCT pl.user_id) AS likes,
            ARRAY_AGG(DISTINCT pc.comment_text) AS comments
        FROM posts p
        LEFT JOIN post_images pi ON pi.post_id = p.id
        LEFT JOIN post_videos pv ON pv.post_id = p.id
        LEFT JOIN post_likes pl ON pl.post_id = p.id
        LEFT JOIN post_comments pc ON pc.post_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, p.caption
        LIMIT 1
        `,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updatePost(id: number, p: PostType): Promise<PostType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE posts SET post_caption=$3 WHERE id=$1 AND user_id=$2 RETURNING *`,
        values: [id, p.user_id, p.post_caption]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deletePost(id: number, user_id: number): Promise<PostType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING id',
        values: [id, user_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Post;
