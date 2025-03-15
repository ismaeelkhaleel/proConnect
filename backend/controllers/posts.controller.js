import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import brycpt from "bcrypt";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json("success");
};

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const diffMs = now - new Date(createdAt);

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months /12 );

  if(years>0) return `${years}y`;
  if (months > 0) return `${months}mo`;
  if (days > 0) return `${days}d `;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m `;
  return "Just now";
};

 


export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("userId", "name username email profilePicture")
        .exec();
  
       
      const postsWithTime = posts.map(post => ({
          ...post.toObject(),
          timeAgo: getTimeAgo(post.createdAt)  
      }));
  
      return res.json({ posts: postsWithTime });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete({ _id: post_id });

    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ messgae: "User not found" });
    }

    const post = await Post.findById({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();

    return res.json({ message: "Comment added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "username name profilePicture")
      .sort({ createdAt: -1 });

    const commentsWithTime = comments.map((comment) => ({
      ...comment.toObject(),
      timeAgo: getTimeAgo(comment.createdAt),
    }));

    return res.json(commentsWithTime);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(comment_id); // Corrected this line

    return res.json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increament_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = post.likes + 1;

    await post.save();

    return res.json({ message: "Like Added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const decrement_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post npt found" });
    }

    post.likes = post.likes - 1;

    await post.save();

    return res.json({ message: "Like Removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
