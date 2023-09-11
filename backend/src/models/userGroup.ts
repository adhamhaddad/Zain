import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type UserGroupType = {
  id?: number;
  group_id: string;
  user_id: number;
};
class UserGroup {
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
  async createUserGroup(
    connection: PoolClient,
    ug: UserGroupType
  ): Promise<UserGroupType> {
    const query = {
      text: `
      INSERT INTO users_groups (group_id, user_id) VALUES ($1, $2)
      RETURNING (SELECT name FROM groups WHERE id = $1) AS group
      `,
      values: [ug.group_id, ug.user_id]
    };
    const result = await connection.query(query);
    return result.rows[0];
  }
  async getUserGroups(user_id: number): Promise<UserGroupType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `SELECT * FROM users_groups WHERE user_id = $1`,
        values: [user_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async updateUserGroup(id: number, ug: UserGroupType): Promise<UserGroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE users_groups SET group_id=$3 WHERE id=$1 AND user_id=$2 RETURNING *`,
        values: [id, ug.user_id, ug.group_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default UserGroup;
