import { graphqlRequest } from './client';

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Task = {
  id: number;
  name: string;
  desc: string;
  owner: number;
};

export function getUsers() {
  return graphqlRequest<{ users: User[] }>(`
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `);
}

export function createUser(variables: { name: string; email: string }) {
  return graphqlRequest<{ createUser: User }, typeof variables>(
    `
      mutation CreateUser($name: String!, $email: String!) {
        createUser(name: $name, email: $email) {
          id
          name
          email
        }
      }
    `,
    variables
  );
}

export function deleteUser(variables: { id: number }) {
  return graphqlRequest<{ deleteUser: User }, typeof variables>(
    `
      mutation DeleteUser($id: Int!) {
        deleteUser(id: $id) {
          id
          name
          email
        }
      }
    `,
    variables
  );
}

export function getTasks() {
  return graphqlRequest<{ tasks: Task[] }>(`
    query GetTasks {
      tasks {
        id
        name
        desc
        owner
      }
    }
  `);
}

export function createTask(variables: { name: string; desc: string; owner: number }) {
  return graphqlRequest<{ createTask: Task }, typeof variables>(
    `
      mutation CreateTask($name: String!, $desc: String!, $owner: Int!) {
        createTask(name: $name, desc: $desc, owner: $owner) {
          id
          name
          desc
          owner
        }
      }
    `,
    variables
  );
}

export function deleteTask(variables: { id: number }) {
  return graphqlRequest<{ deleteTask: Task }, typeof variables>(
    `
      mutation DeleteTask($id: Int!) {
        deleteTask(id: $id) {
          id
          name
          desc
          owner
        }
      }
    `,
    variables
  );
}
