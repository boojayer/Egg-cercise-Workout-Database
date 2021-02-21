const { db } = require('./db');
const { Exercise } = require('./Exercise');

class User {

  /**
   * creates new instance of User
   * @param {string} username name of user (unique)
   * @param {string} password password of user (not plaintext)
   * @param {string} email email of user (unique)
   */

  constructor(username, password, email) {
    this.id = undefined;
    this.username = username;
    this.password = password;
    this.email = email;
  }

  /**
   * inserts a new user into table
   * @returns {Promise<User>} instance of User that called with method + id
   */

  save() {
    const that = this;
    const sql = `INSERT INTO users
      (username, password, email)
      VALUES (?, ?, ?)`;
      return new Promise((resolve, reject) => {
        db.run(sql, [this.username, this.password, this.email], function(error) {
          if(error) {
            console.error(error);
            reject(error);
          }
          that.id = this.lastID;
          resolve(that);
        })
      })
  }

  /**
   * gets all exercises created by a certain user
   * (requires saved or fetched User instance)
   * @returns {Promise<Exercise[]>} array of exercises
   */

  getExercises() {
    const sql = `SELECT * FROM exercises WHERE creator = ?`;
    return new Promise((resolve, reject) => {
      db.all(sql, [this.id], (error, rows) => {
        if(error) {
          console.error(error);
          reject(error);
        }
        resolve(rows.map(row => {
          const exercise = new Exercise(row.name, row.description);
          delete row.creator;
          exercise.id = row.id;
          exercise.rating = row.rating;
          return exercise;
        }));
      });
    });
  }

  /**
   * creates new user table
   * @returns {Promise<void>} empty promise :(
   */

  static createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      UNIQUE(username, email)
    )`;
    return new Promise((resolve, reject) => {
      db.run(sql, error => {
        if(error) {
          console.error(error);
          reject(error);
        }
        resolve();
      });
    });
  }

  /**
   * fetch user by id
   * @param {number} id user primary key
   * @returns {Promise<User>} user instance (with id)
   */

  static find(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (error, row) => {
        if(error) {
          console.error(error);
          reject(error);
        }
        if(!row) return resolve();
        const user = new User(row.username, row.password, row.email);
        user.id = row.id;
        resolve(user);
      })
    })
  }

  /**
   * gets all users in the table
   * @returns {Promise<User[]>} all users
   */

  static all() {
    const sql = `SELECT * FROM users`;
    return new Promise((resolve, reject) => {
      db.all(sql, (error, rows) => {
        if(error) {
          console.error(error);
          reject(error);
        }
        const users = rows.map(row => {
          const user = new User(row.username, row.password, row.email);
          user.id = row.id;
          return user;
        });
        resolve(users);
      });
    });
  }
}

exports.User = User;