const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { route } = require("./auth");
const { verifyToken } = require("../middlewares/auth.middlewares");
const slug = require("slug");
const { findById, findOneAndDelete } = require("../models/Article");

/**
 * @route {get} /articles
 * @desc return All the Articles
 * @access Authentication Optional
 */
router.get("/", async (req, res) => {
  try {
    let loggedInUser = null;

    if (typeof req.userData !== "undefined") {
      loggedInUser = await User.findOne({ _id: user.userData.sub });
    }

    const query = {};
    let limit = 20;
    let offset = 0;

    if (typeof req.query.limit !== "undefined") {
      limit = req.query.limit;
    }

    if (typeof req.query.offset !== "undefined") {
      offset = req.query.offset;
    }

    if (typeof req.query.tag !== "undefined") {
      query.tagList = { $in: [req.query.tag] };
    }

    if (typeof req.query.author !== "undefined" && req.query.author) {
      const user = await User.findOne({ username: req.query.author });
      query.author = user._id;
    }
    if (typeof req.query.favorited !== "undefined" && req.query.favorited) {
      const user = await User.findOne({ username: req.query.favorited });
      query._id = user._id;
    }

    const articles = await Article.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: "desc" })
      .populate("author")
      .exec();

    const articlesCount = await Article.countDocuments(query);

    res.status(200).send({
      articles: articles.map(function (article) {
        return article.toJSONFor(loggedInUser);
      }),
      articlesCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/**
 * @route {get} /articles/feed
 * @desc returns articles to show in the feed of the user
 * @access Authentication Required
 */
router.get("/feed", verifyToken, async (req, res) => {
  if (!req.token) return res.sendStatus(401);
  try {
    let limit = 20;
    let offset = 0;

    if (typeof req.query.limit !== "undefined") {
      limit = req.query.limit;
    }

    if (typeof req.query.offset !== "undefined") {
      offset = req.query.offset;
    }

    const user = await User.findById({ _id: req.userData.sub });

    Promise.all([
      Article.find({ author: { $in: user.following } })
        .limit(Number(limit))
        .skip(Number(offset))
        .populate("author")
        .exec(),
      Article.countDocuments({ author: { $in: user.following } }),
    ]).then(function (results) {
      var articles = results[0];
      var articlesCount = results[1];

      return res.json({
        articles: articles.map(function (article) {
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount,
      });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @route {get} /articles/:slug
 * @desc return Article by slug
 * @access Authentication Not Required
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug });

    if (!article) return res.status(404).send("Not Found");

    await article
      .populate({
        path: "author",
      })
      .execPopulate();

    return res.status(200).send({ article: article.toJSONFor() });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @route {post} /articles
 * @desc Creates a Article
 * @access Authentication Required
 */
router.post("/", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    // console.log(req.userData.sub);
    const user = await User.findById({ _id: req.userData.sub });

    if (!user) {
      return res.status(401).send("Invalid User");
    }

    const article = new Article(req.body.article);
    article.author = user;
    await article.save();

    return res.status(201).send({ article: article.toJSONFor(user) });
  } catch (err) {
    return res.status(500).send(err);
  }
});

//  Update Article
router.put("/:slug", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;
    const user = await User.findById(req.userData.sub);
    const article = await Article.findOne({ slug }).populate("author");

    if (!article) return res.sendStatus(404);

    if (article.author._id.toString() === user._id.toString()) {
      if (typeof req.body.article.title !== "undefined") {
        article.title = req.body.article.title;
        article.slug = slugify(req.body.article.title);
      }
      if (typeof req.body.article.description !== "undefined") {
        article.description = req.body.article.description;
      }

      if (typeof req.body.article.body !== "undefined") {
        article.body = req.body.article.body;
      }

      if (typeof req.body.article.tagList !== "undefined") {
        article.tagList = req.body.article.tagList;
      }

      return res.status(200).send({ article: article.toJSONFor(user) });
    } else {
      return res.status(403).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/**
 * @route {delete} /articles/:slug
 * @desc Deletes the article by slug
 * @access Authentication Required
 */
router.delete("/:slug", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;
    const user = await User.findById(req.userData.sub);
    const article = await Article.findOne({ slug });

    if (!article) return res.status(404).status("Article Not found");

    if (article.author._id.toString() === user._id.toString()) {
      await Article.deleteOne({ slug });
      return res.sendStatus(204);
    } else {
      return res.status(403).send("UnAuthorized");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @route {post} /articles/:slug/favorite
 * @desc marks an article favorite
 * @access Authentication Required
 */
router.post("/:slug/favorite", verifyToken, async (req, res, next) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;

    const user = await User.findOne({ _id: req.userData.sub });
    if (!user) {
      return res.sendStatus(401);
    }
    const article = await Article.findOne({ slug });

    if (!article) return res.status(404).status("Article Not found");

    await article.populate("author", function (err) {
      console.log(err);
    });
    // console.log(user);
    await user.favorite(article._id);
    await article.updateFavoriteCount();
    // console.log(article);
    return res.status(200).send({ article: article.toJSONFor(user) });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

/**
 * @route {delete} /articles/:slug/favorite
 * @desc marks an article unfavorite
 * @access Authentication Required
 */
router.delete("/:slug/favorite", verifyToken, async (req, res, next) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;

    const user = await User.findOne({ _id: req.userData.sub });
    if (!user) {
      return res.sendStatus(401);
    }

    const article = await Article.findOne({ slug });
    if (!article) return res.status(404);

    await article.populate("author", function (err) {
      console.log(err);
    });

    await user.unfavorite(article._id);
    await article.updateFavoriteCount();

    return res.status(200).send({ article: article.toJSONFor(user) });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/**
 * @route {post} /:slug/comments
 * @desc Creates a comment on a article by the user
 * @access Authentication Required
 */
router.post("/:slug/comments", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;

    if (typeof req.body.comment.body === "undefined") {
      return res.status(400).send("Empty Comment");
    }

    const comment = new Comment({ body: req.body.comment.body });
    const user = await User.findOne({ _id: req.userData.sub });
    if (!user) {
      return res.sendStatus(401);
    }

    const article = await Article.findOne({ slug });
    if (!article) return res.status(400).send("Article Not found");

    comment.author = req.userData.sub;
    comment.article = article._id;

    await comment.save();
    article.comments.push(comment._id);
    await article.save();

    comment.populate("author", function (err) {
      if (err) return res.status(500).send(err);
      res.status(200).send({ comment: comment.toJSONFor(user) });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/**
 * @route {delete} /articles/:slug/comments/:id
 * @desc deletes a comment on an article
 * @access Authentication Required
 */
router.delete("/:slug/comments/:id", verifyToken, async (req, res) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  try {
    const { slug } = req.params;
    const { id } = req.params;
    console.log(id);
    let article = await Article.findOne({ slug });
    if (!article) return res.status(404).send("Not Found");

    const commentIndex = article.comments.indexOf(id);
    if (commentIndex === -1) {
      return res.status(404).send("Comment  not Found");
    }

    const comment = await Comment.findById({ _id: id });
    if (!commentIndex) return res.status(404).send("Comment  not Found");

    if (comment.author.toString() === req.userData.sub.toString()) {
      article.comments.splice(commentIndex, 1);
      await article.save();
      await Comment.findByIdAndDelete({ _id: id });

      return res.sendStatus(204);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

/**
 * @route {get} /articles/:slug/comments
 * @desc gets all comments of an article by slug
 * @access Authentication Optional
 */
router.get("/:slug/comments", verifyToken, async (req, res) => {
  try {
    let user = null;
    const { slug } = req.params;
    if (req.token) {
      user = await User.findById({ _id: req.userData.sub });
    }
    // console.log(user);
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).status("Article Not found");

    await article.populate("comments").execPopulate();
    Promise.all(
      article.comments.map(async function (comment) {
        return comment.populate("author").execPopulate();
      })
    )
      .then((comments) => {
        if (!comments) return res.sendStatus(404);
        return res.send({
          comments: comments.map((comment) => {
            return comment.toJSONFor(user);
          }),
        });
      })
      .catch(function (err) {
        return res.status(500).send(err.message);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

function slugify(title) {
  return (
    slug(title) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  );
}

module.exports = router;
