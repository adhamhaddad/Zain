import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type UserLevelType = {
  id?: number;
  level_id: string;
  user_id: number;
};
class UserLevel {
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
  async createUserLevel(
    connection: PoolClient,
    ul: UserLevelType
  ): Promise<UserLevelType> {
    const query = {
      text: `
      INSERT INTO users_level (level_id, user_id) VALUES ($1, $2)
      RETURNING (SELECT level FROM levels WHERE id = $1) AS level
      `,
      values: [ul.level_id, ul.user_id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async updateUserLevel(id: number, ul: UserLevelType): Promise<UserLevelType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE users_level SET level_id=$3 WHERE id=$1 AND user_id=$2 RETURNING *`,
        values: [id, ul.user_id, ul.level_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default UserLevel;
