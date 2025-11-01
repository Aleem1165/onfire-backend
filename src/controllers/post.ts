import { Request, Response } from "express";
import { Post } from "../models/post";
import { Like } from "../models/like";
import { Comment } from "../models/comment";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content, images } = req.body;
        const _id = req._id

        const newPost = await Post.create({
            author: _id, content,
            images: images
        });
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

        await Like.deleteMany({ post: postId });

        await Post.findByIdAndDelete(postId)

        res.status(200).json({ success: true, message: "Post and related likes deleted successfully" });
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
        
    } catch (error) {
        
    }
}