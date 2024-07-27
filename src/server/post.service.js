const postModel = require("../models/post.model");

class PostService {
  async create(post) {
    const newPost = await postModel.create(post);
    return newPost;
  }

  async getAll() {
    const allPosts = await postModel.find();
    return allPosts;
  }

  async delete(id) {
    const post = await postModel.findByIdAndDelete(id);
    return post;
  }

  async edit(post, id) {
    if (!id) {
      throw new Error("Id is not defined");
    }
    const updateData = await postModel.findByIdAndUpdate(id, post);
    return updateData;
  }
}

module.exports = new PostService();
