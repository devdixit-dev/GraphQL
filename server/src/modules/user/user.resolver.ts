import { userService } from './user.service';

export const userResolvers = {
  Query: {
    users: async () => {
      return userService.getUsers();
    }
  },
  Mutation: {
    createUser: async (_: any, args: { name: string; email: string }) => {
      return userService.createUser(args.name, args.email);
    },

    updateUser: async (_: any, args: { id: number, name: string }) => {
      return userService.updateUser(args.id, args.name);
    }
  }
};