import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type GroupType = {
  id?: number;
  name: string;
  level_id: number;
  created_at?: Date;
};
class Group {
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
  async createGroup(g: GroupType): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO groups (name, level_id) VALUES ($1, $2) RETURNING *',
        values: [g.name, g.level_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getGroups(level_id: number): Promise<GroupType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `SELECT * FROM groups WHERE level_id = $1`,
        values: [level_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async updateGroup(id: number, g: GroupType): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE groups SET name=$2, level_id=$3 WHERE id=$1 RETURNING *`,
        values: [id, g.name, g.level_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteGroup(id: number): Promise<GroupType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `DELETE FROM groups WHERE id=$1 RETURNING id`,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Group;
