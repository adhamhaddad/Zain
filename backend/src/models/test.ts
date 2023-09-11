import { PoolClient } from 'pg';
import { pgClient } from '../database';
import TestImage, { TestImageType } from './testImage';

export type TestType = {
  id?: number;
  name: number;
  group_id: number;
  degree: number;
  images: string[];
  created_at?: Date;
};
class Test {
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
  async createTest(t: TestType): Promise<TestType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        const query = {
          text: 'INSERT INTO tests (name, group_id, degree) VALUES ($1, $2, $3) RETURNING *',
          values: [t.name, t.group_id, t.degree]
        };
        const result = await connection.query(query);
        const { id: test_id } = result.rows[0];

        // Test Image Query
        const testImage = new TestImage();
        const image_urls: TestImageType[] = [];

        if (t.images.length) {
          for (let image of t.images) {
            const result = await testImage.createTestImages(connection, {
              test_id,
              image_url: image
            });
            image_urls.push(result);
          }
        }
        return { ...result.rows[0], test_images: image_urls };
      });
    });
  }
  async getTests(group_id: number): Promise<TestType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT t.*, array_agg(ti.image_url) AS test_images
        FROM tests t
        LEFT JOIN test_images ti ON ti.test_id = t.id
        WHERE t.group_id = $1
        GROUP BY t.id
        `,
        values: [group_id]
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getTest(id: number): Promise<TestType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT t.*, array_agg(ti.image_url) AS test_images
        FROM tests t
        LEFT JOIN test_images ti ON ti.test_id = t.id
        WHERE t.id = $1
        GROUP BY t.id
        `,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateTest(id: number, t: TestType): Promise<TestType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'UPDATE tests SET name=$2, degree=$3 WHERE id=$1 RETURNING *',
        values: [id, t.name, t.degree]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteTest(id: number): Promise<TestType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM tests WHERE id=$1 RETURNING *',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default Test;
