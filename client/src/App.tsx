import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createTask, createUser, deleteTask, deleteUser, getTasks, getUsers, Task, User } from './graphql/operations';

type LoadState = {
  users: User[];
  tasks: Task[];
};

const initialState: LoadState = {
  users: [],
  tasks: []
};

export function App() {
  const [data, setData] = useState<LoadState>(initialState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userOptions = useMemo(() => data.users.map((user) => ({ id: user.id, label: `${user.name} (${user.email})` })), [
    data.users
  ]);

  async function loadData() {
    setError('');
    setLoading(true);

    const [usersResult, tasksResult] = await Promise.allSettled([getUsers(), getTasks()]);

    setData({
      users: usersResult.status === 'fulfilled' ? usersResult.value.users : [],
      tasks: tasksResult.status === 'fulfilled' ? tasksResult.value.tasks : []
    });

    if (usersResult.status === 'rejected' || tasksResult.status === 'rejected') {
      const message = [usersResult, tasksResult]
        .filter((result) => result.status === 'rejected')
        .map((result) => (result.reason instanceof Error ? result.reason.message : 'Could not load GraphQL data'))
        .join(', ');

      setError(message);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(event.currentTarget);

    try {
      await createUser({
        name: String(form.get('name')),
        email: String(form.get('email'))
      });
      event.currentTarget.reset();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create user');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(event.currentTarget);

    try {
      await createTask({
        name: String(form.get('name')),
        desc: String(form.get('desc')),
        owner: Number(form.get('owner'))
      });
      event.currentTarget.reset();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeUser(id: number) {
    setSubmitting(true);
    setError('');

    try {
      await deleteUser({ id });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete user');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeTask(id: number) {
    setSubmitting(true);
    setError('');

    try {
      await deleteTask({ id });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fastify + Mercurius</p>
          <h1>GraphQL Client</h1>
        </div>
        <button type="button" onClick={() => void loadData()} disabled={loading || submitting}>
          Refresh
        </button>
      </header>

      {error ? <div className="alert">{error}</div> : null}

      <section className="panel-grid">
        <form className="panel" onSubmit={(event) => void handleCreateUser(event)}>
          <h2>Create User</h2>
          <label>
            Name
            <input name="name" placeholder="Ada Lovelace" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="ada@example.com" required />
          </label>
          <button type="submit" disabled={submitting}>
            Add User
          </button>
        </form>

        <form className="panel" onSubmit={(event) => void handleCreateTask(event)}>
          <h2>Create Task</h2>
          <label>
            Name
            <input name="name" placeholder="Write schema" required />
          </label>
          <label>
            Description
            <textarea name="desc" placeholder="Describe the work" required />
          </label>
          <label>
            Owner
            <select name="owner" required disabled={!userOptions.length}>
              <option value="">Select a user</option>
              {userOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={submitting || !userOptions.length}>
            Add Task
          </button>
        </form>
      </section>

      <section className="data-grid">
        <div>
          <h2>Users</h2>
          <div className="list">
            {loading ? <p className="muted">Loading users...</p> : null}
            {!loading && !data.users.length ? <p className="muted">No users yet.</p> : null}
            {data.users.map((user) => (
              <article className="row" key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <button type="button" onClick={() => void removeUser(user.id)} disabled={submitting}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2>Tasks</h2>
          <div className="list">
            {loading ? <p className="muted">Loading tasks...</p> : null}
            {!loading && !data.tasks.length ? <p className="muted">No tasks yet.</p> : null}
            {data.tasks.map((task) => (
              <article className="row" key={task.id}>
                <div>
                  <strong>{task.name}</strong>
                  <span>{task.desc}</span>
                  <small>Owner #{task.owner}</small>
                </div>
                <button type="button" onClick={() => void removeTask(task.id)} disabled={submitting}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
