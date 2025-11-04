import { Request, Response } from "express";
import { Post } from "../models/post";
import { Like } from "../models/like";
import { Comment } from "../models/comment";
import { User } from "../models/user";
import { getPostPopulateOptions } from "../utils/populateOptions";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, images } = req.body;
        const _id = req._id

        const newPost = await Post.create({
            author: _id, content,
            images: images
        });

        await User.findByIdAndUpdate(
            _id,
            { $addToSet: { posts: newPost._id } },
            { new: true }
        );

        res.status(201).json({
            success: true, message: "Post created successfully", post: newPost
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const _id = req._id!
        const { postId } = req.params;
        const { content, images } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({ success: false, message: "*Post not found" });
            return
        }

        if (post.author.toString() !== _id.toString()) {
            res.status(403).json({ success: false, message: "*You are not allowed to edit this post" });
            return
        }

        post.content = content;
        post.images = images;

        await post.save();

        res.status(200).json({ success: true, message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ success: false, message: "*Post not found" });
            return
        }

        if (post.author.toString() !== _id.toString()) {
            res.status(403).json({ success: false, message: "*You are not allowed to delete this post" });
            return
        }

        await Promise.all([
            Like.deleteMany({ post: postId }),
            Comment.deleteMany({ post: postId }),
        ]);

        if (!post.sharedFrom && post.sharedBy && post.sharedBy.length > 0) {
            await Post.updateMany(
                { sharedFrom: post._id },
                { $set: { originalDeleted: true } }
            );
        }

        await Post.findByIdAndDelete(postId)

        await User.findByIdAndUpdate(
            _id,
            { $pull: { posts: postId } }
        );

        res.status(200).json({ success: true, message: "Post and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const addOrUpdateLike = async (req: Request, res: Response) => {
    try {
        const _id = req._id!
        const { postId } = req.params;
        const { reaction } = req.body

        const existingLike = await Like.findOne({ author: _id, post: postId });

        let like;

        if (existingLike) {
            existingLike.reaction = reaction;
            like = await existingLike.save();
        } else {
            like = await Like.create({
                author: _id,
                post: postId,
                reaction,
            });

            await Post.findByIdAndUpdate(postId, {
                $addToSet: { likes: like._id }
            });
        }

        res.status(200).json({
            success: true,
            message: existingLike ? "Reaction updated successfully" : "Like added successfully",
            data: like,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const deleteLike = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { postId } = req.params;

        const like = await Like.findOneAndDelete({ author: _id, post: postId });
        if (!like) {
            res.status(404).json({ success: false, message: "*No like found for this post" });
            return
        }

        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: like._id },
        });

        res.status(200).json({ success: true, message: "Like removed successfully", });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}


export const addComment = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { postId } = req.params;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "*Post not found" });
        }

        const comment = await Comment.create({ author: _id, post: postId, content });
        await Post.findByIdAndUpdate(postId, { $addToSet: { comments: comment._id } });

        res.status(201).json({ success: true, message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const updateComment = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: "*Comment not found" });
            return
        }

        if (comment.author.toString() !== _id.toString()) {
            res.status(403).json({ success: false, message: "*You are not allowed to edit this comment" });
            return
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({ success: true, message: "Comment updated successfully", comment });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: "*Comment not found" });
            return
        }

        if (comment.author.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: "*You are not allowed to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);

        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id },
        });

        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        let posts;

        if (postId) {
            posts = await Post.findById(postId).populate(getPostPopulateOptions).sort({ createdAt: -1 });

            if (!posts) {
                res.status(404).json({ success: false, message: "*Post not found" });
                return
            }

            return res.status(200).json({ success: true, message: "Post fetched successfully", post: posts });
        }

        posts = await Post.find().populate(getPostPopulateOptions).sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Posts fetched successfully", posts });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};

export const sharePost = async (req: Request, res: Response) => {
    try {
        const _id = req._id!;
        const { postId } = req.params;
        const { content } = req.body;

        const targetPost = await Post.findById(postId);
        if (!targetPost) {
            res.status(404).json({ success: false, message: "*Post not found" });
            return
        }

        if (targetPost.originalDeleted) {
            res.status(400).json({
                success: false, message: "*You cannot share this post because the original post has been deleted"
            });
            return;
        }

        const rootPostId = targetPost.sharedFrom ? targetPost.sharedFrom : targetPost._id;

        const originalPost = await Post.findById(rootPostId);
        if (!originalPost) {
            res.status(404).json({ success: false, message: "*Original post not found" });
            return
        }

        const sharedPost = await Post.create({
            author: _id,
            content: content || "",
            sharedFrom: rootPostId,
        });

        await User.findByIdAndUpdate(_id, { $addToSet: { posts: sharedPost._id } });

        await Post.findByIdAndUpdate(rootPostId, { $addToSet: { sharedBy: _id } });

        res.status(201).json({
            success: true, message: "Post shared successfully", post: sharedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};

export const deleteSharedPost = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { postId } = req.params;

        const sharedPost = await Post.findById(postId);
        if (!sharedPost) {
            res.status(404).json({ success: false, message: "*Shared post not found" });
            return;
        }

        if (!sharedPost.sharedFrom) {
            res.status(400).json({
                success: false, message: "*This is not a shared post. Please use the regular post delete API."
            });
            return;
        }

        if (sharedPost.author.toString() !== _id.toString()) {
            res.status(403).json({ success: false, message: "*You are not allowed to delete this shared post" });
            return;
        }

        if (sharedPost.sharedFrom) {
            const originalPost = await Post.findById(sharedPost.sharedFrom);
            if (originalPost) {
                originalPost.sharedBy = originalPost.sharedBy.filter(
                    (id: any) => id.toString() !== _id.toString()
                );
                await originalPost.save();
            }
        }

        await Post.findByIdAndDelete(postId);

        await User.findByIdAndUpdate(_id, { $pull: { posts: postId } });

        res.status(200).json({
            success: true, message: "Shared post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};