import { Router } from "express";
import { addComment, addOrUpdateLike, createPost, deleteComment, deleteLike, deletePost, deleteSharedPost, getPosts, sharePost, updateComment, updatePost } from "../controllers/post";
import { IsAuth } from "../middlewares/isAuth";
import { validate } from "../middlewares/validate";
import { commentValidation, createPostValidation, likeValidation } from "../validations/post";

const router = Router()

router.post('/create', IsAuth, validate(createPostValidation), createPost)
router.put("/update/:postId", IsAuth, validate(createPostValidation), updatePost);
router.delete("/delete/:postId", IsAuth, deletePost);
router.post("/addOrUpdateLike/:postId", IsAuth, validate(likeValidation), addOrUpdateLike);
router.delete("/deleteLike/:postId", IsAuth, deleteLike);
router.post("/addComment/:postId", IsAuth, validate(commentValidation), addComment);
router.put("/updateComment/:commentId", IsAuth, validate(commentValidation), updateComment);
router.delete("/deleteComment/:commentId", IsAuth, deleteComment);
router.post("/share/:postId", IsAuth, sharePost);
router.delete("/deleteShare/:postId", IsAuth, deleteSharedPost);
router.get("/all", IsAuth, getPosts);
router.get("/:postId", IsAuth, getPosts);

export default router