const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId)
      return res.status(403).json("他の人の投稿なので編集できません。");
    await post.updateOne({
      $set: req.body,
    });
    res.status(200).json("投稿の更新が完了しました。");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const deletePost = await Post.findById(req.params.id);
    if (deletePost.userId !== req.body.userId)
      return res.status(403).json("他の人の投稿は削除できません。");
    await deletePost.deleteOne();
    res.status(200).json("投稿の削除に成功しました。");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    //投稿の情報を持ってくる
    console.log(56);
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    console.log(60);
    //既にいいねをしていなければユーザをpushする
    if (!post.likes.includes(req.body.userId)) {
      console.log(61);
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      res.status(200).json("いいねをしました。");
      //既にいいねをしていればユーザをpullする
    } else {
      console.log(69);
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      res.status(200).json("いいねを外しました。");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//タイムラインの投稿を取得する
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    console.log(currentUser);
    const userPosts = await Post.find({ userId: currentUser._id });
    console.log("fP");
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
