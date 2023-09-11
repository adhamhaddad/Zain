import { Router } from 'express';
import {
  auth,
  users,
  profilePictures,
  categories,
  groups,
  levels,
  usersGroups,
  usersLevel,
  posts,
  postLikes,
  postComments
} from './api';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/profile-pictures', profilePictures);
router.use('/categories', categories);
router.use('/groups', groups);
router.use('/levels', levels);
router.use('/user-groups', usersGroups);
router.use('/user-levels', usersLevel);
router.use('/posts', posts);
router.use('/post-likes', postLikes);
router.use('/post-comments', postComments);

export default router;
