const router = require("express").Router();
const User = require("../models/User");
//CRUD
//ユーザの更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます。");
  }
});
//ユーザの削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザ情報が削除されました。");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});
//ユーザの取得
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, updatedAt, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });
//ユーザの取得
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに自分がいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        res.status(200).json("フォローに成功しました！");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません。");
  }
});

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーに存在していればフォローを外せる

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        res.status(200).json(`${user.username}さんをフォローから外しました。`);
      } else {
        return res
          .status(403)
          .json("あなたはこのユーザーをフォローしていません。");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身にフォローを外す操作はできません。");
  }
});
module.exports = router;
