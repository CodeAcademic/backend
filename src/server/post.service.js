const postModel = require("../models/post.model");
const fileService = require("./file.service");

class PostService {
  async create(post, picture) {
    const fileName = fileService.save(picture)
    const newPost = await postModel.create({...post, picture: fileName});
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
    const isPost = await this.getOne(id)
    if (!isPost) {
      throw new Error('Post with existing ID not found')
    }
    const updateData = await postModel.findByIdAndUpdate(id, post);
    return updateData;
  }

  async getOne(id) {
    const post = await postModel.findById(id)
    return post
  }
}

module.exports = new PostService();
