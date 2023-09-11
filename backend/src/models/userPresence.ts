import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type UserPresenceType = {
  id?: number;
  user_id: number;
  degree: number;
  is_presence: boolean;
  created_at?: Date;
};
class UserPresence {
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
  async createUserPresence(up: UserPresenceType): Promise<UserPresenceType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO users_presences (user_id, degree, is_presence) VALUES ($1, $2, $3) RETURNING *',
        values: [up.user_id, up.degree, up.is_presence]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getUserPresences(user_id: number): Promise<UserPresenceType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM users_presences WHERE user_id = $1',
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async updateUserPresence(
    id: number,
    up: UserPresenceType
  ): Promise<UserPresenceType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE users_presences SET is_presence=$2 WHERE id=$1 AND user_id=$2 RETURNING *`,
        values: [id, up.user_id, up.is_presence]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default UserPresence;
