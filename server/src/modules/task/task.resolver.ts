import { taskService } from './task.service';

export const taskResolvers = {
  Query: {
    tasks: async () => {
      return taskService.getTasks();
    }
  },
  Mutation: {
    createTask: async (_: any, args: { name: string; desc: string; owner: number }) => {
      return taskService.createTask(args.owner, args.name, args.desc);
    },

    updateTask: async (_: any, args: { id: number; name: string; desc: string }) => {
      return taskService.updateTask(args.id, args.name, args.desc);
    },

    deleteTask: async (_: any, args: { id: number }) => {
      return taskService.deleteTask(args.id);
    }
  }
};
