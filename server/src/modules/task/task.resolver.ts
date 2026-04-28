import { taskService } from "./task.service"

export const taskResolvers = () => {
  Query: {
    tasks: async () => {
      return taskService.getTasks();
    }
  }
  Mutation: {
    createTask: async (_:any, args: { name: string, desc: string }) => {
      
    }
  }
}