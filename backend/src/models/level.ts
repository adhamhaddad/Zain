import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type LevelType = {
  id?: number;
  level: string;
};
class Level {
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
  async createLevel(l: LevelType): Promise<LevelType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO levels (level) VALUES ($1) RETURNING *',
        values: [l.level]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getLevels(): Promise<LevelType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `SELECT * FROM levels`
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async updateLevel(id: number, l: LevelType): Promise<LevelType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE levels SET level=$2 WHERE id=$1 RETURNING level`,
        values: [id, l.level]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteLevel(id: number): Promise<LevelType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `DELETE FROM levels WHERE id=$1 RETURNING id`,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Level;
