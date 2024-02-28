import { GraphQLObjectType } from 'graphql';
import { ResolveContext } from '../context.js';
import { changePostMutation, createPostMutation, deletePostMutation } from './post.js';
import {
  changeProfileMutation,
  createProfileMutation,
  deleteProfileMutation,
} from './profile.js';
import {
  changeUserMutation,
  createUserMutation,
  deleteUserMutation,
  subscribeToMutation,
  unsubscribeFromMutation,
} from './user.js';

export const MutationType = new GraphQLObjectType<null, ResolveContext>({
  name: 'Mutation',
  fields: () => ({
    createPost: createPostMutation,
    changePost: changePostMutation,
    deletePost: deletePostMutation,
    createUser: createUserMutation,
    changeUser: changeUserMutation,
    deleteUser: deleteUserMutation,
    subscribeTo: subscribeToMutation,
    unsubscribeFrom: unsubscribeFromMutation,
    createProfile: createProfileMutation,
    changeProfile: changeProfileMutation,
    deleteProfile: deleteProfileMutation,
  }),
});
