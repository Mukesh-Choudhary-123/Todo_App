import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import TaskInput from '../components/TaskInput';
import globalStyles from '../styles/global';
import colors from '../styles/colors';

import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
SQLite.DEBUG(true);

let db;

const initDb = async () => {
  db = await SQLite.openDatabase({ name: 'Todo.db', location: 'default' });
  return db.executeSql(
    `CREATE TABLE IF NOT EXISTS todos (
       id INTEGER PRIMARY KEY NOT NULL,
       title TEXT NOT NULL,
       done INTEGER NOT NULL
     );`
  );
};

const insertTodoService = title =>
  db.transaction(tx =>
    tx.executeSql('INSERT INTO todos (title, done) VALUES (?, 0);', [title])
  );

const fetchTodosService = () =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM todos;',
        [],
        (_, { rows }) => {
          const list = [];
          for (let i = 0; i < rows.length; i++) {
            list.push(rows.item(i));
          }
          resolve(list);
        },
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });

const toggleDoneService = (id, currentDone) =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE todos SET done = ? WHERE id = ?;',
        [currentDone ? 0 : 1, id],
        () => resolve(),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });

const deleteTodoService = id =>
  new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM todos WHERE id = ?;',
        [id],
        () => resolve(),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await initDb();
        const list = await fetchTodosService();
        setTodos(list);
      } catch (err) {
        console.error('DB init/load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (title) => {
    try {
      await insertTodoService(title);
      const list = await fetchTodosService();
      setTodos(list);
    } catch (err) {
      console.error('Insert error:', err);
    }
  };

  const handleToggle = async (id, done) => {
    try {
      await toggleDoneService(id, done);
      const list = await fetchTodosService();
      setTodos(list);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteTodoService(id);
      const list = await fetchTodosService();
      setTodos(list);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          globalStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header />

      <TaskInput onAdd={handleAdd} />

      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            id={item.id}
            title={item.title}
            done={item.done === 1}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
}
