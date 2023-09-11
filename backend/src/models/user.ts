import { PoolClient } from 'pg';
import { pgClient } from '../database';
import Password, { PasswordType } from './password';
import UserGroup, { UserGroupType } from './userGroup';
import UserLevel, { UserLevelType } from './userLevel';

enum UserRoles {
  admin = 'admin',
  moderator = 'moderator',
  student = 'student'
}

export type UserType = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  role: UserRoles;
  created_at?: Date;
  updated_at?: Date;
  delete_at?: Date;
};
class User {
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
  async createAdminUser(u: UserType & PasswordType): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        const password = new Password();
        const query = {
          text: `
            INSERT INTO users (first_name, last_name, middle_name, phone, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, middle_name, phone, role
          `,
          values: [u.first_name, u.last_name, u.middle_name, u.phone, u.role]
        };
        const result = await connection.query(query);
        const { id: user_id } = result.rows[0];
        await password.createPassword(connection, {
          user_id,
          password: u.password
        });
        return result.rows[0];
      });
    });
  }
  async createUser(
    u: UserType & PasswordType & UserLevelType & UserGroupType
  ): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      return this.withTransaction(connection, async () => {
        const password = new Password();
        const userGroup = new UserGroup();
        const userLevel = new UserLevel();
        // User Query
        const query = {
          text: `
            INSERT INTO users (first_name, last_name, middle_name, phone, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, middle_name, phone, role
          `,
          values: [
            u.first_name,
            u.last_name,
            u.middle_name,
            u.phone,
            UserRoles.student
          ]
        };
        const result = await connection.query(query);
        const { id: user_id } = result.rows[0];
        // Level Query
        const levelResult = await userLevel.createUserLevel(connection, {
          user_id,
          level_id: u.level_id
        });
        // Group Query
        const groupResult = await userGroup.createUserGroup(connection, {
          user_id,
          group_id: u.group_id
        });
        // Password Query
        await password.createPassword(connection, {
          user_id,
          password: u.phone
        });
        return { ...result.rows[0], ...levelResult, ...groupResult };
      });
    });
  }
  async getUsers(): Promise<UserType[]> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT
          u.id, 
          CONCAT(u.first_name, ' ', u.middle_name, ' ', u.last_name) AS fullName,
          u.phone,
          u.role,
          COALESCE(
            (
              SELECT image_url
              FROM profile_pictures pp
              WHERE pp.user_id = u.id
              ORDER BY pp.created_at DESC
              LIMIT 1
            ),
            NULL
          ) AS image_url,
          (SELECT name FROM groups g WHERE g.id = ug.group_id ) AS group,
          (SELECT level FROM levels l WHERE l.id = ul.level_id ) AS level
        FROM users u
        LEFT JOIN users_level ul ON ul.user_id = u.id
        LEFT JOIN users_groups ug ON ug.user_id = u.id
        WHERE u.role = 'student'
        `
      };
      const result = await connection.query(query);
      return result.rows;
    });
  }
  async getUser(id: number): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
        SELECT
          u.id, 
          CONCAT(u.first_name, ' ', u.middle_name, ' ', u.last_name) AS fullName,
          u.phone,
          u.role,
          COALESCE(
            (
              SELECT image_url
              FROM profile_pictures pp
              WHERE pp.user_id = u.id
              ORDER BY pp.created_at DESC
              LIMIT 1
            ),
            NULL
          ) AS image_url,
          (SELECT name FROM groups g WHERE g.id = ug.group_id ) AS group,
          (SELECT level FROM levels l WHERE l.id = ul.level_id ) AS level
        FROM users u
        LEFT JOIN users_level ul ON ul.user_id = u.id
        LEFT JOIN users_groups ug ON ug.user_id = u.id
        WHERE u.id=$1
        `,
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async updateUser(id: number, u: UserType): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
          UPDATE users SET
          first_name=$2, middle_name=$3, last_name=$4, phone=$5
          WHERE id=$1
          RETURNING *
        `,
        values: [id, u.first_name, u.middle_name, u.last_name, u.phone]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async changePhoneNumber(id: number, u: UserType): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: `
          UPDATE users SET phone=$2, updated_at=CURRENT_TIMESTAMP
          WHERE id=$1
          RETURNING *
        `,
        values: [id, u.phone]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
  async deleteUser(id: number): Promise<UserType> {
    return this.withConnection(async (connection: PoolClient) => {
      const query = {
        text: 'DELETE FROM users WHERE id=$1 RETURNING id',
        values: [id]
      };
      const result = await connection.query(query);
      return result.rows[0];
    });
  }
}
export default User;
