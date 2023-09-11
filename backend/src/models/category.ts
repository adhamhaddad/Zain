import { PoolClient } from 'pg';
import { pgClient } from '../database';

export type CategoryType = {
  id?: number;
  name: string;
  group_id: number;
  created_at?: Date;
};
class Category {
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
  async createCategory(c: CategoryType): Promise<CategoryType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'INSERT INTO categories (name, group_id) VALUES ($1, $2) RETURNING id, name',
        values: [c.name, c.group_id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async getCategories(group_id: number): Promise<CategoryType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'SELECT * FROM categories WHERE group_id = $1',
        values: [group_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async updateCategory(id: number, c: CategoryType): Promise<CategoryType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `UPDATE categories SET name=$2 WHERE id=$1 RETURNING id, name`,
        values: [id, c.name]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteCategory(id: number): Promise<CategoryType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `DELETE FROM categories WHERE id=$1 RETURNING id`,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Category;
