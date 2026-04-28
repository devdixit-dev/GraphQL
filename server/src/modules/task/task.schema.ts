export const taskSchema = `
  type Task {
    id: Int!
    name: String!
    desc: String!
    owner: Int!
  }
  
  type Query {
    tasks: [Task!]!
  }
  
  type Mutation {
    createTask(name: String!, desc: String!, owner: Int!): Task!
    updateTask(id: Int!, name: String, desc: String): Task!
    deleteTask(id: Int!): Task!
  }
`;
